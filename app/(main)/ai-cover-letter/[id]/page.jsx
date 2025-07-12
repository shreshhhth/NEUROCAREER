import { getCoverLetter } from "@/actions/coverletter";
import Link from "next/link";
import React from "react";
import CoverLetterPreview from "../_components/cover-letter-preview";
import { Button } from "@/components/ui/button";

const CoverLetter = async ({ params }) => {
  const { id } = await params.id;

  const coverLetter = await getCoverLetter(id);

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-2">
        <Link href="/ai-cover-letter">
          <Button variant="link" className="gap-2 pl-0">
            Back to cover letter
          </Button>
        </Link>

        <h1 className="text-6xl font-bold gradient-title mb-6">
          {coverLetter?.jobTitle} at {coverLetter?.companyName}
        </h1>
      </div>

      <CoverLetterPreview content={coverLetter?.content} />
    </div>
  );
};

export default CoverLetter;
