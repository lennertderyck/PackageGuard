import { cn } from "@/src/lib/utils/styling";
import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";
import classNames from "classnames";
import { ComponentProps, FC } from "react";

interface LinkListItem extends ComponentProps<"button"> {
  asChild?: boolean;
}

export const LinkListItem: FC<LinkListItem> = ({ asChild, ...otherProps }) => {
  const Comp = asChild ? Slot : "button";

  return (
    <li className="py-3 group">
      <Comp
        className={classNames(
          "flex items-start gap-3 hover:bg-white/5 p-4 rounded-md group-first:rounded-t-xl group-last:rounded-b-xl transition-colors"
        )}
        {...otherProps}
      />
    </li>
  );
};

const linkListVariants = cva("divide-y rounded-3xl px-3", {
  variants: {
    variant: {
      filled: "bg-white/5 divide-white/10",
      outline: "border divide-white/15 border-white/15"
    }
  },
  defaultVariants: {
    variant: "outline"
  }
});

interface Props
  extends ComponentProps<"ul">,
    VariantProps<typeof linkListVariants> {}

const LinkList: FC<Props> = ({ className, variant, ...otherProps }) => {
  return (
    <ul
      className={cn(linkListVariants({ variant }), className)}
      {...otherProps}
    />
  );
};

export default LinkList;
