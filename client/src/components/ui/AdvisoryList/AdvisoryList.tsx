import { cn } from "@/src/lib/utils/styling";
import { AdvisorySource } from "@/src/types/advisory";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import LinkList, { LinkListItem } from "../../element/LinkList/LinkList";

export const AdvisoryList: FC<{ advisories: AdvisorySource[] }> = ({
  advisories
}) => {
  return (
    <LinkList variant="filled">
      {advisories.map((advisory, advisoryIndex) => (
        <LinkListItem key={advisoryIndex} asChild>
          <Link
            href={advisory.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              advisory.resolvedResult.length === 0 &&
                "**:opacity-85 pointer-events-none"
            )}
          >
            <div className="flex flex-1 gap-5">
              <Image
                src={advisory.logoAsset}
                alt="Logo Aikido"
                className="size-5 translate-y-1"
              />
              <div>
                <h4>
                  <span className="font-bold">{advisory.name}</span> /{" "}
                  {advisory.about}
                </h4>
                <p>
                  {advisory.resolvedResult.length === 0
                    ? "No advisory found"
                    : advisory.resolvedResult}
                </p>
              </div>
            </div>
            {advisory.resolvedResult.length !== 0 && <ArrowRight />}
          </Link>
        </LinkListItem>
      ))}
    </LinkList>
  );
};
