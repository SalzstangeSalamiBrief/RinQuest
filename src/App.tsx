import { useState } from "react";
import "./App.css";
import { StartScreen } from "@pages/StartScreen";
import { EndScreen } from "@pages/EndScreen";
import { GameScreen } from "@pages/GameScreen";
import { HelpScreen } from "@pages/HelpScreen";
import { ScreensToDisplay } from "@models/ScreensToDisplay";

function App() {
  const [screenToDisplay, setScreenToDisplay] = useState<ScreensToDisplay>(
    ScreensToDisplay.StartScreen
  );

  return (
    <main className="p-8">
      {getScreenToDisplay(screenToDisplay, setScreenToDisplay)}
    </main>
  );
}

const getScreenToDisplay = (
  screenToDisplay: ScreensToDisplay,
  setScreenToDisplay: (selectedScreen: ScreensToDisplay) => void
) => {
  switch (screenToDisplay) {
    case ScreensToDisplay.StartScreen:
      return <StartScreen onChangeScreen={setScreenToDisplay} />;
    case ScreensToDisplay.GameScreen:
      return <GameScreen />;
    case ScreensToDisplay.EndScreen:
      return <EndScreen />;
    case ScreensToDisplay.HelpScreen:
      return (
        <HelpScreen
          onGoBack={() => setScreenToDisplay(ScreensToDisplay.StartScreen)}
        />
      );
  }
};

export default App;
