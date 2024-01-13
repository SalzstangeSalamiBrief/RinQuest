interface IButtonProps {
  buttonType: "primary" | "danger";
  label: string;
  onClick: () => void;
}

export function Button({ buttonType, label, onClick }: IButtonProps) {
  const classes = `${baseButtonStyles} ${buttonStylesOfType[buttonType]}`;
  return (
    <button className={classes} onClick={onClick}>
      {label}
    </button>
  );
}

const baseButtonStyles =
  "w-32 bg-transparent font-semibold hover:text-white py-2 px-4 border hover:border-transparent rounded";

const buttonStylesOfType: Record<IButtonProps["buttonType"], string> = {
  primary: "hover:bg-blue-400 text-blue-700 border-blue-500",
  danger: "hover:bg-red-500 text-gray-700 border-gray-500 ",
};
