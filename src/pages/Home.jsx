import { useState, useReducer, useEffect } from "preact/hooks";
import poster from "../assets/poster.svg";

function readLocalStorage() {
  const teams = localStorage.getItem("teams");
  console.log("reading teams", teams);
  if (teams) {
    return JSON.parse(teams);
  }
  return [
    {
      id: 0,
      name: "35th North",
      roundScores: [0, 0, 0, 0, 0, 0],
    },
    {
      id: 1,
      name: "35th Ave",
      roundScores: [0, 0, 0, 0, 0, 0],
    },
    {
      id: 2,
      name: "Pops",
      roundScores: [0, 0, 0, 0, 0, 0],
    },
    {
      id: 3,
      name: "Black Market",
      roundScores: [0, 0, 0, 0, 0, 0],
    },
    {
      id: 4,
      name: "Location",
      roundScores: [0, 0, 0, 0, 0, 0],
    },
    {
      id: 5,
      name: "By And By",
      roundScores: [0, 0, 0, 0, 0, 0],
    },
    {
      id: 6,
      name: "Team 7",
      roundScores: [0, 0, 0, 0, 0, 0],
    },
    {
      id: 7,
      name: "Team 8",
      roundScores: [0, 0, 0, 0, 0, 0],
    },
  ];
}

const initialTeams = readLocalStorage();

function saveTeamsToLocalStorage(teams) {
  localStorage.setItem("teams", JSON.stringify(teams));
}

const reducer = (state, action) => {
  switch (action.type) {
    case "change-team-round-score":
      const { teamId, round, score } = action.payload;
      const newState = [...state];
      newState.find((team) => team.id === teamId).roundScores[round] = score;
      saveTeamsToLocalStorage(newState);
      return newState;

    case "change-team-name": {
      const { teamId, name } = action.payload;
      const newState = [...state];
      newState.find((team) => team.id === teamId).name = name;
      saveTeamsToLocalStorage(newState);
      return newState;
    }

    case "reset": {
      console.log("reset");
      return readLocalStorage();
    }

    default: {
      return state;
    }
  }
};

function addRoundScores(team) {
  return team.roundScores.reduce((a, b) => a + b, 0);
}

const fadeRoundView = (roundView, round) => {
  // fade round if not the current roundView
  if (roundView > -1 && roundView !== round) {
    return "fade";
  }
};

export function Home() {
  const [teams, dispatch] = useReducer(reducer, initialTeams);

  /**
   * roundView is the index of the round to show
   * -1 is overview
   * 0-5 is the round
   * 6 is the totals
   */
  const [roundView, setRoundView] = useState(0);

  const teamsSorted = teams.sort(
    (a, b) => addRoundScores(b) - addRoundScores(a)
  );
  return (
    <>
      <div class="grid" style="">
        <div class="rounds team">
          <div class="empty"></div>
          <button class="empty" onClick={() => setRoundView(-1)}>
            <img src={poster} />
          </button>
          {Array.from(Array(6).keys()).map((round) => (
            <button
              class={`cell ${fadeRoundView(roundView, round)}`}
              onClick={() => {
                if (roundView === round) {
                  setRoundView(-1);
                } else {
                  setRoundView(round);
                }
              }}
            >
              <p>
                Round
                <br />
                {round + 1}
              </p>
            </button>
          ))}
          <button
            class="cell"
            onClick={() => {
              if (roundView === 6) {
                setRoundView(-1);
              } else {
                setRoundView(6);
              }
            }}
          >
            <p>Totals</p>
          </button>
        </div>

        {/* Overview */}
        {teamsSorted.map((team, index) => (
          <div class="team">
            <div class="cell">
              <p>{index + 1}</p>
            </div>
            <div class="cell">
              <input
                class="team-name"
                value={team.name}
                onBlur={(e) =>
                  dispatch({
                    type: "change-team-name",
                    payload: { teamId: team.id, name: e.target.value },
                  })
                }
              />
            </div>
            {team.roundScores.map((score, round) => (
              <div class={`cell ${fadeRoundView(roundView, round)}`}>
                <input
                  type="number"
                  class="team-score"
                  value={score}
                  onBlur={(e) =>
                    dispatch({
                      type: "change-team-round-score",
                      payload: {
                        teamId: team.id,
                        name: team.name,
                        round,
                        score: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
            ))}
            <div class="cell">
              <p>{addRoundScores(team)}</p>
            </div>
          </div>
        ))}
      </div>

      <div style="margin-top: 80vh">
        {/* button to clear localStorage */}
        <button
          onClick={() => {
            if (window.confirm("this will reset everything, are you sure?")) {
              localStorage.clear();
              dispatch({ type: "reset" });
            }
          }}
        >
          reset everything
        </button>
      </div>
    </>
  );
}
