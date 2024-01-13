import { ScreensToDisplay } from "../App";
import { Button } from "../components/Button";

interface IStartScreenProps {
  onChangeScreen: (selectedScreen: ScreensToDisplay) => void;
}

export function StartScreen({ onChangeScreen }: IStartScreenProps) {
  return (
    <section className="flex flex-col items-center justify-center gap-8">
      <img width="512" src="/rinQuest_Title.svg" />
      <Button
        buttonType="primary"
        label="Start Game"
        onClick={() => onChangeScreen(ScreensToDisplay.GameScreen)}
      />
      <Button
        buttonType="primary"
        label="Help"
        onClick={() => onChangeScreen(ScreensToDisplay.HelpScreen)}
      />
    </section>
  );
}
