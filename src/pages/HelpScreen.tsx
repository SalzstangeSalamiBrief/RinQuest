import { Button } from "@components/Button";

interface IHelpScreenProps {
  onGoBack: () => void;
}

export function HelpScreen({ onGoBack }: IHelpScreenProps) {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Help</h1>
      <div>
        <h2 className="text-md font-semibold">How to Play</h2>
        <p>
          You play a knight who wants to defeat the greater evil that threatens
          the world. To accomplish his goal the knight requires the help of the
          almighty wizard (you). On your quest you travel together and if some
          henchmen of the greater evil appear, the knight will fight. But you
          have to help him to defeat the henchmen. To do so, you have to give
          orders to the knight.
        </p>
      </div>
      <div>
        <h2 className="text-md font-semibold">Controls</h2>
        <p>
          You can command the knight with your keyboard by pressing one of these
          buttons:
        </p>
        <table className="my-4 mx-auto">
          <thead>
            <tr>
              {Object.keys(controls[0]).map((k, index) => (
                <td key={index} className="font-semibold">
                  {k}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {controls.map((control, i) => (
              <tr key={i}>
                {Object.values(control).map((v, j) => (
                  <td key={j} className={j === 0 ? "w-24" : undefined}>
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center">
        <Button buttonType="primary" label="Main Menu" onClick={onGoBack} />
      </div>
    </section>
  );
}

const controls = [
  {
    key: "W",
    description: "Move your character to the top",
  },
  {
    key: "A",
    description: "Move move your character to the left",
  },
  {
    key: "S",
    description: "Move your character to the bottom",
  },
  {
    key: "D",
    description: "Move your character to the right",
  },
  {
    key: "Space",
    description: "Attack with your figure",
  },
];
