"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useFetch from "@/hooks/use-fetch";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import QuizResult from "./quiz-result";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplaination, setShowExplaination] = useState(false);

  const {
    data: quizData,
    loading: generatingQuiz,
    fn: generateQuizFn,
  } = useFetch(() => generateQuiz());

  const {
    data: resultData,
    loading: savingResult,
    fn: saveQuizResultFn,
    setData: setResultData,
  } = useFetch(saveQuizResult);

  console.log(resultData);

  const handleGenerateQuiz = () => {
    generateQuizFn(); //manually called when needed
  };

  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);

  if (generatingQuiz) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  {
    /*----------For calculating Score----------- */
  }
  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === quizData[index].correctAnswer) {
        correct++;
      }
    });
    return (correct / quizData.length) * 100;
  };

  //Saving quiz data in database
  const finishQuiz = async () => {
    const score = calculateScore();
    try {
      const res = await saveQuizResultFn(quizData, answers, score);
      toast.success("Quiz completed!");
    } catch (error) {
      toast.error(error.message || "Failed to save quiz results");
    } finally {
    }
  };

  //Starting new quiz by making everything null
  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplaination(false);
    handleGenerateQuiz();
    setResultData(null);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplaination(false);
    } else {
      finishQuiz();
    }
  };

  //Show results if quiz is compelted
  if (resultData) {
    return (
      <div>
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
      </div>
    );
  }

  if (!quizData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle> Ready to Test Your Knowledge?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This quiz contains 10 questions specific to your industry and
            skills. Take your time and choose the best answer for each question.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            className={"w-full"}
            onClick={handleGenerateQuiz}
            disabled={generatingQuiz}
          >
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Question {currentQuestion + 1} of {quizData.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{question.question}</p>
        <RadioGroup
          className="space-y-2"
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
        >
          {question.options.map((option, index) => {
            return (
              <div className="flex items-center space-x-2" key={index}>
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            );
          })}
        </RadioGroup>

        {/*Logic for explaination */}
        {showExplaination && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">Explaination</p>
            <p className="text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!showExplaination && (
          <Button
            onClick={() => setShowExplaination(true)}
            variant="outline"
            disabled={!answers[currentQuestion]}
          >
            Show Explanation
          </Button>
        )}
        <Button
          onClick={handleNext}
          className="ml-auto"
          disabled={!answers[currentQuestion] || savingResult}
        >
          {savingResult && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {currentQuestion < quizData.length - 1
            ? "Next Question"
            : "Finish Quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Quiz;
