let roles = [];
let currentPlayer = 0;

let players = [];
let alivePlayers = [];

let soundOn = true;
let narratorOn = true;
let customPlayerNames = [];

/* ================= ROLE INFO ================= */

const roleInfo = {

    MAFIA: {
        image: "images/mafia.png",
        desc: "Eliminate players secretly"
    },

    GODFATHER: {
        image: "images/godfather.png",
        desc: "Leader of the Mafia"
    },

    DOCTOR: {
        image: "images/doctor.png",
        desc: "Save one player"
    },

    DETECTIVE: {
        image: "images/detective.png",
        desc: "Investigate suspects"
    },

    JOKER: {
        image: "images/joker.png",
        desc: "Get voted out to win"
    },

    CIVILIAN: {
        image: "images/civilian.png",
        desc: "Find the Mafia"
    }

};

/* ================= AUDIO ================= */

function playSound(id) {

    if (!soundOn) return;

    let audio = document.getElementById(id);

    if (audio) {

        audio.currentTime = 0;
        audio.play();

    }

}

/* ================= NARRATOR ================= */

function narrate(text) {

    if (!narratorOn) return;

    let speech =
        new SpeechSynthesisUtterance(text);

    speech.rate = 0.9;
    speech.pitch = 0.7;

    window.speechSynthesis.speak(speech);

}

/* ================= SCREEN ================= */

function showScreen(id) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.add("hidden");

        });

    document
        .getElementById(id)
        .classList.remove("hidden");

}

/* ================= MENU ================= */

function showSetup() {

    playSound("clickSound");

    showScreen("setupScreen");

}

function showHowToPlay() {

    playSound("clickSound");

    showScreen("howScreen");

}

function showSettings() {

    playSound("clickSound");

    showScreen("settingsScreen");

}

function backMenu() {

    playSound("clickSound");

    showScreen("menuScreen");

}

/* ================= PLAYER SETTINGS ================= */

function showPlayerSettings() {

    playSound("clickSound");

    showScreen("playerSettingsScreen");

    generateSettingsPlayerInputs();

}

function generateSettingsPlayerInputs() {

    let total =
        parseInt(
            document.getElementById(
                "settingsPlayerCount"
            ).value
        );

    let container =
        document.getElementById(
            "settingsPlayerInputs"
        );

    container.innerHTML = "";

    for (let i = 1; i <= total; i++) {

        let savedName =
            customPlayerNames[i - 1] ||
            "Player " + i;

        container.innerHTML += `

        <input
        type="text"
        id="settingsPlayer${i}"
        value="${savedName}"
        placeholder="Player ${i} Name">

        `;

    }

}

function savePlayerNames() {

    customPlayerNames = [];

    let total =
        parseInt(
            document.getElementById(
                "settingsPlayerCount"
            ).value
        );

    for (let i = 1; i <= total; i++) {

        let name =
            document.getElementById(
                "settingsPlayer" + i
            ).value;

        if (name.trim() === "") {

            name = "Player " + i;

        }

        customPlayerNames.push(name);

    }

    playSound("clickSound");

    alert("Player names saved!");

}

function saveDiscussionTime() {

    discussionTime =
        parseInt(
            document.getElementById(
                "discussionTimeInput"
            ).value
        );

    playSound("clickSound");

    alert("Discussion timer updated!");

}

/* ================= SETTINGS ================= */

function toggleSound() {

    soundOn = !soundOn;

    document
        .getElementById("soundBtn")
        .innerText =
        soundOn
            ? "SOUND : ON"
            : "SOUND : OFF";

}

function toggleNarrator() {

    narratorOn = !narratorOn;

    document
        .getElementById("narratorBtn")
        .innerText =
        narratorOn
            ? "NARRATOR : ON"
            : "NARRATOR : OFF";

}

/* ================= START GAME ================= */

let discussionTime = 30;

function startGame() {

    roles = [];
    players = [];
    alivePlayers = [];

    currentPlayer = 0;

    let total =
        parseInt(
            document.getElementById("totalPlayers").value
        );

    let mafia =
        parseInt(
            document.getElementById("mafiaCount").value
        );

    let doctor =
        parseInt(
            document.getElementById("doctorCount").value
        );

    let detective =
        parseInt(
            document.getElementById("detectiveCount").value
        );

    let godfather =
        parseInt(
            document.getElementById("godfatherCount").value
        );

    let joker =
        parseInt(
            document.getElementById("jokerCount").value
        );

    addRole("MAFIA", mafia);
    addRole("DOCTOR", doctor);
    addRole("DETECTIVE", detective);
    addRole("GODFATHER", godfather);
    addRole("JOKER", joker);

    while (roles.length < total) {

        roles.push("CIVILIAN");

    }

    shuffleRoles();

    for (let i = 0; i < roles.length; i++) {

        let playerName =
            customPlayerNames[i] ||
            "Player " + (i + 1);

        players.push(playerName);

        alivePlayers.push(true);

    }

    document
        .getElementById("playerTurn")
        .innerText =
        players[0] + " Turn";

    document
        .getElementById("bgMusic")
        .play();

    showScreen("roleScreen");

}

/* ================= SHOW ROLE ================= */

function showRole() {

    let role = roles[currentPlayer];

    document
        .getElementById("roleCard")
        .classList.remove("hidden");

    document
        .getElementById("roleName")
        .innerText = role;

    document
        .getElementById("roleDesc")
        .innerText =
        roleInfo[role].desc;

    document
        .getElementById("roleImg")
        .src =
        roleInfo[role].image;

    playSound("revealSound");

    document
        .getElementById("nextBtn")
        .classList.remove("hidden");

}

/* ================= NEXT PLAYER ================= */

function nextPlayer() {

    currentPlayer++;

    document
        .getElementById("roleCard")
        .classList.add("hidden");

    document
        .getElementById("nextBtn")
        .classList.add("hidden");

    if (currentPlayer >= roles.length) {

        narrate(
            "Discussion phase starts"
        );

        showScreen("discussionScreen");

        return;

    }

    document
        .getElementById("playerTurn")
        .innerText =
        players[currentPlayer] + " Turn";

}

/* ================= TIMER ================= */

function startTimer() {

    let time = discussionTime;

    document
        .getElementById("timer")
        .innerText = time;

    let timer =
        setInterval(() => {

            time--;

            document
                .getElementById("timer")
                .innerText = time;

            if (time <= 0) {

                clearInterval(timer);

                narrate(
                    "Voting time"
                );

            }

        }, 1000);

}

/* ================= START VOTING ================= */

function startVoting() {

    showScreen("voteScreen");

    startVotingButtons();

}

/* ================= VOTING BUTTONS ================= */

let votes = {};
let currentVoterIndex = 0;
let aliveIndexes = [];

/* ================= START VOTING ================= */

function startVoting() {

    showScreen("voteScreen");

    votes = {};

    currentVoterIndex = 0;

    aliveIndexes = [];

    for (let i = 0; i < players.length; i++) {

        if (alivePlayers[i]) {

            aliveIndexes.push(i);

        }

    }

    showVotingTurn();

}

/* ================= SHOW VOTING TURN ================= */

function showVotingTurn() {

    let voteList =
        document.getElementById("voteList");

    let voteResult =
        document.getElementById("voteResult");

    voteList.innerHTML = "";

    if (
        currentVoterIndex >=
        aliveIndexes.length
    ) {

        finishVoting();

        return;

    }

    let voter =
        aliveIndexes[currentVoterIndex];

    voteResult.innerHTML = `

    <h3 style="margin-bottom:15px;">
        ${players[voter]}'s Turn To Vote
    </h3>

    `;

    for (let i = 0; i < players.length; i++) {

        if (
            alivePlayers[i] &&
            i !== voter
        ) {

            let btn =
                document.createElement(
                    "button"
                );

            btn.innerText =
                players[i];

            btn.onclick = () => {

                castVote(i);

            };

            voteList.appendChild(btn);

        }

    }

}

/* ================= CAST VOTE ================= */

function castVote(votedPlayer) {

    playSound("voteSound");

    if (!votes[votedPlayer]) {

        votes[votedPlayer] = 0;

    }

    votes[votedPlayer]++;

    currentVoterIndex++;

    showVotingTurn();

}

/* ================= FINISH VOTING ================= */

function finishVoting() {

    let highestVotes = 0;

    let votedOut = null;

    let tie = false;

    for (let player in votes) {

        if (votes[player] > highestVotes) {

            highestVotes =
                votes[player];

            votedOut = parseInt(player);

            tie = false;

        }

        else if (
            votes[player] === highestVotes
        ) {

            tie = true;

        }

    }

    let result =
        document.getElementById(
            "voteResult"
        );

    document.getElementById(
        "voteList"
    ).innerHTML = "";

    /* ================= TIE ================= */

    if (tie || votedOut === null) {

        result.innerHTML = `

        <h2>
            No player was eliminated
        </h2>

        <p style="margin-top:10px;">
            Mafia are still in the game...
        </p>

        `;

        return;

    }

    /* ================= ELIMINATE PLAYER ================= */

    alivePlayers[votedOut] = false;

    /* ================= JOKER WIN ================= */

    if (roles[votedOut] === "JOKER") {

        result.innerHTML = `

    <h2>
        ${players[votedOut]} was voted out
    </h2>

    <p style="margin-top:10px;">
        Joker achieved his mission!
    </p>

    `;

        setTimeout(() => {

            endGame("JOKER WINS");

        }, 1500);

        return;

    }

    /* ================= NORMAL ELIMINATION ================= */

    result.innerHTML = `

    <h2>
        ${players[votedOut]}
        was voted out
    </h2>

    <p style="margin-top:10px;">
    Mafia are still in the game...
    </p>

    `;

}

/* ================= CONTINUE ================= */

function continueGame() {

    checkWinner();

}

/* ================= WIN CHECK ================= */

function checkWinner() {

    let mafiaAlive = 0;

    let othersAlive = 0;

    for (let i = 0; i < roles.length; i++) {

        if (alivePlayers[i]) {

            if (
                roles[i] === "MAFIA" ||
                roles[i] === "GODFATHER"
            ) {

                mafiaAlive++;

            } else {

                othersAlive++;

            }

        }

    }

    /* ================= */
    /* CIVILIANS WIN */
    /* ================= */

    if (mafiaAlive === 0) {

        endGame("CIVILIANS WIN");

        return;

    }

    /* ================= */
    /* MAFIA WIN */
    /* ================= */

    if (mafiaAlive >= othersAlive) {

        endGame("MAFIA WINS");

        return;

    }

    /* ================= */
    /* CONTINUE */
    /* ================= */

    showScreen("discussionScreen");

}

/* ================= END GAME ================= */

function endGame(text) {

    showScreen("endScreen");

    document
        .getElementById("winnerText")
        .innerText = text;

    playSound("winSound");

    narrate(text);

}

/* ================= HELPERS ================= */

function addRole(role, count) {

    for (let i = 0; i < count; i++) {

        roles.push(role);

    }

}

function shuffleRoles() {

    for (let i = roles.length - 1; i > 0; i--) {

        let j =
            Math.floor(Math.random() * (i + 1));

        [roles[i], roles[j]] =
            [roles[j], roles[i]];

    }

}
if ("serviceWorker" in navigator) {

    navigator.serviceWorker.register("sw.js");

}
