"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QuizResult from "./quiz-result";

const QuizList = ({ assessments }) => {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle className="gradient-title text-3xl md:text-4xl">
              Recent Quizzes
            </CardTitle>
            <CardDescription>Review your past quiz performance</CardDescription>
          </div>
          <Button onClick={() => router.push("/interview/mock")}>
            Start New Quiz
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {assessments.map((assessment, index) => (
            <Card
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setSelectedQuiz(assessment)}
              key={assessment.id}
            >
              <CardHeader>
                <CardTitle>Quiz {index + 1}</CardTitle>
                <CardDescription className="flex justify-between w-full">
                  <div>Score: {assessment.quizScore.toFixed(1)}%</div>
                  <div>
                    {format(
                      new Date(assessment.createdAt),
                      "MMMM dd, yyyy HH:mm"
                    )}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {assessment.improvementTip}
                </p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/*Dialog box */}
      <Dialog
        open={!!selectedQuiz}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedQuiz(null);
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <QuizResult
          result={selectedQuiz}
          onStartNew={()=> router.push("/interview/mock")}
          hideStartNew
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuizList;
