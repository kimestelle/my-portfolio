import React from "react";

export type CodeDemoProps = {
    id: string;
    title?: string;
    blurb?: string;
    demo?: React.ReactNode;
    notices?: readonly string[];
    codeTitle?: string;
    code?: string;
    defaultOpen?: boolean;
    className?: string;
};

const CodeDemo: React.FC<CodeDemoProps> = ({
    id,
    title,
    blurb,
    demo,
    notices = [],
    codeTitle = "tiny code",
    code = "",
    defaultOpen = false,
    className = "",
}) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  return (
    <section key={id} className="mt-8">
        <h2 className="text-xl font-semibold">{title}</h2>
          {blurb && <p className="text-gray-600 half-margin">{blurb}</p>}
          <ul>
          {notices && notices.map((note, i) => (
            <li key={i} className="ml-6 text-neutral-500">{note}</li>
          ))}
          </ul>
    {demo || code ? (   
    <div className={"w-full p-2 my-4 bg-neutral-100" + className}>
      <div className="flex flex-col gap-2">
        {/* demo area */}
        {demo && 
        <div className="sm:col-span-8">
          <div className="rounded-md h-64 md:h-120 flex justify-center items-center border bg-white p-2">
              {demo}
          </div>
        </div>
        }

        {code &&
          <details className="rounded-md bg-neutral-50 p-2 border" open={defaultOpen}>
            <summary className="cursor-pointer text-sm font-medium flex items-center justify-between">
              <span>&#8661; {codeTitle}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCopy();
                }}
                className="text-xs px-2 py-1 rounded-md border bg-white hover:bg-neutral-100"
                aria-label="Copy code"
              >
                copy
              </button>
            </summary>
            <pre className="mt-2 overflow-x-auto text-xs">
              <code>{code}</code>
            </pre>
          </details>
        }
        </div>
    </div>
    ) : null}
    </section>
  );
};

export default CodeDemo;
