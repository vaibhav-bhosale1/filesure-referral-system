'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';

// Simple copy icon
const CopyIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

export const ReferralLink: React.FC<{ link: string }> = ({ link }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied!');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground">
        Your Unique Referral Link
      </h3>
      <p className="mb-4 mt-1 text-sm text-gray-400">
        Share this link to earn credits when your friends make a purchase.
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          value={link}
          className="flex h-10 w-full rounded-md border border-border 
                     bg-background px-3 py-2 text-sm text-gray-300"
        />
        <Button
          onClick={handleCopy}
          className="w-32"
          disabled={isCopied}
        >
          {isCopied ? (
            'Copied!'
          ) : (
            <>
              <CopyIcon /> <span className="ml-2">Copy</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};