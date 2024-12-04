"use client";

import { useUser } from "@clerk/nextjs";
import { courseList } from "@prisma/client";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import DifficultyBadge from "@/app/_components/DifficultyBadge";
import { IoBook } from "react-icons/io5";
import { Badge } from "@/components/ui/badge";
import { SlOptionsVertical } from "react-icons/sl";
import DeleteCourseButton from "./DeleteCourseButton";
import { UserCourseListContext } from "@/app/_context/UserCourseListContext";
import Link from "next/link";

const UserCourseList = () => {
  const { user, isLoaded } = useUser();
  const [courses, setCourses] = useState<courseList[]>([]);
  const [showSkeleton, setShowSkeleton] = useState(true); // Control skeleton visibility
  const { setUserCourseList } = useContext(UserCourseListContext);

  useEffect(() => {
    if (isLoaded && user) {
      getUserCourses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user]);

  useEffect(() => {
    // Set timeout to hide skeleton after 5 seconds if no courses
    const timeout = setTimeout(() => {
      if (courses.length === 0) {
        setShowSkeleton(false);
      }
    }, 5000);

    return () => clearTimeout(timeout); // Clean up timeout
  }, [courses]); // Dependency on courses to check the condition

  const getUserCourses = async () => {
    try {
      const result = await axios.get("/api/course");
      const courses = result.data;
      setCourses(courses);
      setUserCourseList(courses);
      if (courses.length > 0) {
        setShowSkeleton(false); // Hide skeleton if courses are fetched
      }
    } catch (error) {
      console.error("Error fetching user courses:", error);
    }
  };

  const handleOnDelete = async (courseId: string) => {
    try {
      await axios.delete(`/api/course/${courseId}`);
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.courseId !== courseId)
      );
    } catch (error) {
      console.log("Error deleting course");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {showSkeleton && courses.length === 0
        ? [1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="bg-slate-400 w-full h-[300px] animate-pulse rounded-lg"
            ></div>
          ))
        : courses?.length > 0
        ? courses.map((course) => {
            const output =
              typeof course.courseOutput === "string"
                ? JSON.parse(course.courseOutput)
                : course.courseOutput;

            return (
              <div
                key={course.courseId}
                className="hover:cursor-pointer transform transition-transform duration-300 hover:scale-105"
              >
                <Card>
                  <CardHeader>
                    <Link href={`/course/${course.courseId}`}>
                      <Image
                        src={course.imageUrl}
                        alt="course banner"
                        width={100}
                        height={100}
                        className="w-full h-auto rounded-sm"
                      />
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <div className="flex items-center justify-between">
                        <CardTitle>{output["Course Name"]}</CardTitle>
                        <DeleteCourseButton
                          handleOnDelete={() => {
                            handleOnDelete(course.courseId);
                          }}
                        >
                          <SlOptionsVertical className="hover:cursor-pointer" />
                        </DeleteCourseButton>
                      </div>
                      <Badge
                        className="text-sm text-gray-400 mt-2"
                        variant="outline"
                      >
                        {course.category}
                      </Badge>
                      <Link href={`/course/${course.courseId}`}>
                        <CardDescription className="mt-4">
                          {output["Course Description"].slice(0, 100) + "..."}
                        </CardDescription>
                      </Link>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <Link href={`/course/${course.courseId}`}>
                      <Badge variant="outline">
                        <p className=" flex gap-1 items-center text-sm text-primary">
                          {" "}
                          <IoBook />
                          {course?.courseOutput &&
                          Array.isArray(
                            (course.courseOutput as { Chapters: [] }).Chapters
                          )
                            ? (course.courseOutput as { Chapters: [] }).Chapters
                                .length
                            : 0}{" "}
                          chapters
                        </p>
                      </Badge>
                      <DifficultyBadge difficulty={course.difficulty} />
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            );
          })
        : null}
    </div>
  );
};

export default UserCourseList;
