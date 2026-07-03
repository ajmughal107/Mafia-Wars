let roles = [];
let currentPlayer = 0;

let players = [];
let alivePlayers = [];

let soundOn = true;
let narratorOn = true;
let customPlayerNames = [];

let soundEnabled = true;
let narratorEnabled = true;
let musicEnabled = true;

let mafiaTarget = null;
let doctorSave = null;
let detectiveMessage = "";
let nightStage = "";
let nightPlayer = null;

const hostLines = {

    night:
        "Everyone close your eyes. Night has started.",

    mafia:
        "Mafia, wake up. Choose your target.",

    doctor:
        "Doctor, wake up. Choose someone to save.",

    detective:
        "Detective, wake up. Choose someone to investigate.",

    morning:
        "Morning has arrived. Everyone open your eyes.",

    discussion:
        "Discussion time has started. Find the Mafia.",

    voting:
        "Voting time. Choose a player to eliminate.",

    mafiaWin:
        "Mafia wins the game.",

    civilianWin:
        "The Mafia has been eliminated. The town wins.",

    mafiaKill:
        "Mafia has made a kill.",

    doctorSave:
        "Doctor saved the player.",

    doctorFail:
        "Doctor failed to save the player.",

    eliminated:
        "Player has been eliminated."

};

/* ================= ROLE INFO ================= */

const roleInfo = {

    MAFIA: {
        image: "images/mafia.png",
        desc: "Eliminate players secretly"
    },

    GODFATHER: {
        image: "images/godfather.png",
        desc: "Leader of Mafia. Works with Mafia and has same winning goal."
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


    window.speechSynthesis.cancel();


    let speech =
        new SpeechSynthesisUtterance(text);


    speech.rate = 0.85;

    speech.pitch = 0.45;

    speech.volume = 1;


    let voices =
        window.speechSynthesis.getVoices();


    let englishVoice =
        voices.find(
            voice =>
                voice.lang.includes("en")
        );


    if (englishVoice) {

        speech.voice = englishVoice;

    }


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

    soundEnabled = soundOn;

    document
        .getElementById("soundBtn")
        .innerText =
        soundOn
            ? "SOUND : ON"
            : "SOUND : OFF";

    saveSettings();

}

function toggleNarrator() {

    narratorOn = !narratorOn;

    narratorEnabled = narratorOn;

    document
        .getElementById("narratorBtn")
        .innerText =
        narratorOn
            ? "NARRATOR : ON"
            : "NARRATOR : OFF";

    saveSettings();

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


    // CHECK ROLES
    let totalRoles =
        mafia +
        doctor +
        detective +
        godfather +
        joker;


    if (totalRoles > total) {

        alert("Roles are more than players!");

        return;

    }


    // ADD ROLES

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

    if (soundOn) {

        document
            .getElementById("bgMusic")
            .play()
            .catch(() => { });


    }

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

        showScreen("nightScreen");

        narrate(hostLines.night);


        setTimeout(() => {

            startNightActions();

        }, 3000);


        return;

    }

    document
        .getElementById("playerTurn")
        .innerText =
        players[currentPlayer] + " Turn";

}

/* ================= START NIGHT ACTIONS ================= */

/* ================= START MAFIA TURN ================= */
function startNightActions() {

    let mafiaPlayers = [];

    for (let i = 0; i < roles.length; i++) {

        if (
            roles[i] === "MAFIA" ||
            roles[i] === "GODFATHER"
        ) {

            mafiaPlayers.push(i);

        }

    }

    showScreen("actionScreen");

    nightStage = "MAFIA";

    document.getElementById("actionTitle").innerText =
        "🔫 Mafia Choose Target";

    narrate(hostLines.mafia);


    let list =
        document.getElementById("actionList");

    list.innerHTML = "";


    for (let i = 0; i < players.length; i++) {

        if (alivePlayers[i] &&
            !mafiaPlayers.includes(i)) {


            let btn =
                document.createElement("button");


            btn.innerText =
                players[i];


            btn.onclick = () => {

                mafiaTarget = i;

                startDoctorTurn();

            };


            list.appendChild(btn);

        }

    }

}

/* ================= START DOCTOR TURN ================= */

function startDoctorTurn() {


    let doctorAlive =
        roles.indexOf("DOCTOR");


    nightStage = "DOCTOR";


    document.getElementById("actionTitle").innerText =
        "🩺 Doctor Save Player";


    let list =
        document.getElementById("actionList");


    list.innerHTML = "";


    // Doctor dead hai (secret skip)
    if (
        doctorAlive === -1 ||
        !alivePlayers[doctorAlive]
    ) {


        narrate(hostLines.doctor);


        setTimeout(() => {

            startDetectiveTurn();

        }, 6000);


        return;

    }



    // Doctor alive hai
    narrate(hostLines.doctor);



    for (let i = 0; i < players.length; i++) {


        if (alivePlayers[i]) {


            let btn =
                document.createElement("button");


            btn.innerText =
                players[i];


            btn.onclick = () => {


                doctorSave = i;


                startDetectiveTurn();


            };


            list.appendChild(btn);


        }

    }

}

/* ================= START DETECTIVE TURN ================= */

function startDetectiveTurn() {


    let detectiveAlive =
        roles.indexOf("DETECTIVE");


    nightStage = "DETECTIVE";


    document.getElementById("actionTitle").innerText =
        "🕵 Detective Investigate";


    let list =
        document.getElementById("actionList");


    list.innerHTML = "";



    // Detective dead hai (secret skip)
    if (
        detectiveAlive === -1 ||
        !alivePlayers[detectiveAlive]
    ) {


        narrate(hostLines.detective);


        setTimeout(() => {

            startMorning();

        }, 6000);


        return;

    }



    // Detective alive hai
    nightPlayer = detectiveAlive;


    narrate(hostLines.detective);



    for (let i = 0; i < players.length; i++) {


        if (
            alivePlayers[i] &&
            i !== detectiveAlive
        ) {


            let btn =
                document.createElement("button");


            btn.innerText =
                players[i];



            btn.onclick = () => {

                detectiveMessage = "";
                let result;



                if (
                    roles[i] === "MAFIA" ||
                    roles[i] === "GODFATHER"
                ) {

                    detectiveMessage =
                        "The detective knows one of the Mafia.";

                    result =
                        players[i] + " is Mafia";

                }
                else {

                    detectiveMessage =
                        "The detective did not identify any Mafia member.";

                    result =
                        players[i] + " is not Mafia";

                }



                document.getElementById("actionList").innerHTML = `

                <div class="role-card">

                    <h2>
                        ${result}
                    </h2>


                    <button onclick="startMorning()">
                        CONTINUE
                    </button>

                </div>

                `;


            };



            list.appendChild(btn);


        }

    }

}

/* ================= START MORNING Result ================= */
function startMorning() {


    showScreen("morningScreen");


    // Morning announcement

    let resultText =
        document.getElementById("morningResult");


    if (mafiaTarget === doctorSave) {


        resultText.innerText =
            "🌅 Morning: Nobody died. Doctor saved the player!";


        setTimeout(() => {

            narrate(hostLines.mafiaKill);

        }, 2000);


        setTimeout(() => {

            narrate(hostLines.doctorSave);

        }, 4000);


    }
    else {


        killPlayer(mafiaTarget);


        resultText.innerText =
            "🌅 Morning: " +
            players[mafiaTarget] +
            " was killed last night";


        setTimeout(() => {

            narrate(hostLines.mafiaKill);

        }, 2000);


        setTimeout(() => {

            narrate(hostLines.doctorFail);

        }, 4000);


        setTimeout(() => {

            narrate(
                players[mafiaTarget] +
                " was killed last night."
            );

        }, 6000);

        setTimeout(() => {

            if (detectiveMessage !== "") {

                narrate(detectiveMessage);

                detectiveMessage = "";

            }

        }, 9000);

    }

}

/* ================= START DISCUSSION ================= */

function startDiscussion() {

    showScreen("discussionScreen");

    narrate(hostLines.discussion);

}

/* ================= START TIMER ================= */

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
                    hostLines.voting
                );

            }

        }, 1000);

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

        if (!alivePlayers[player]) {
            continue;
        }

        if (votes[player] > highestVotes) {

            highestVotes = votes[player];
            votedOut = parseInt(player);
            tie = false;

        }
        else if (votes[player] === highestVotes) {

            tie = true;

        }

    }

    let result =
        document.getElementById("voteResult");

    document.getElementById("voteList").innerHTML = "";


    /* ================= TIE ================= */

    if (tie || votedOut === null) {

        result.innerHTML = `
            <h2>No player was eliminated</h2>
            <p style="margin-top:10px;">
                Mafia are still in the game...
            </p>
        `;

        setTimeout(() => {

            if (checkWinner()) return;

            startNewNight();

        }, 3000);

        return;
    }


    /* ================= JOKER WIN ================= */

    if (roles[votedOut] === "JOKER") {

        killPlayer(votedOut);

        result.innerHTML = `
            <h2>${players[votedOut]} was voted out</h2>
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

    killPlayer(votedOut);

    result.innerHTML = `
        <h2>${players[votedOut]} was voted out</h2>
        <p style="margin-top:10px;">
            Mafia are still in the game...
        </p>
    `;

    setTimeout(() => {

        if (checkWinner()) return;

        startNewNight();

    }, 3000);

}

/* ================= CONTINUE ================= */

function continueGame() {

    if (checkWinner()) return;


    startNewNight();

}

/* ================= START NEW NIGHT ================= */

function startNewNight() {


    mafiaTarget = null;

    doctorSave = null;


    showScreen("nightScreen");


    narrate(hostLines.night);


    setTimeout(() => {

        startNightActions();

    }, 3000);


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

        return true;

    }

    /* ================= */
    /* MAFIA WIN */
    /* ================= */

    if (mafiaAlive >= othersAlive) {

        endGame("MAFIA WINS");

        return true;

    }

    /* ================= */
    /* CONTINUE */
    /* ================= */

    showScreen("discussionScreen");
    return false;

}

/* ================= KILL PLAYER ================= */

function killPlayer(index) {

    if (!alivePlayers[index]) return;

    alivePlayers[index] = false;

    narrate(players[index] + " is dead.");

}

/* ================= END GAME ================= */

function endGame(text) {

    showScreen("endScreen");

    document
        .getElementById("winnerText")
        .innerText = text;

    playSound("winSound");

    narrate(text);

    document
        .getElementById("playAgainBtn")
        .focus();

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

/* ================= SAVE SETTINGS ================= */

function saveSettings() {

    localStorage.setItem(
        "soundEnabled",
        soundEnabled
    );

    localStorage.setItem(
        "narratorEnabled",
        narratorEnabled
    );

    localStorage.setItem(
        "musicEnabled",
        musicEnabled
    );

}

function loadSettings() {

    let sound =
        localStorage.getItem("soundEnabled");

    let narrator =
        localStorage.getItem("narratorEnabled");

    let music =
        localStorage.getItem("musicEnabled");

    if (sound !== null)
        soundEnabled = sound === "true";

    if (narrator !== null)
        narratorEnabled = narrator === "true";

    if (music !== null)
        musicEnabled = music === "true";

    soundOn = soundEnabled;

    narratorOn = narratorEnabled;

}
loadSettings();

document.getElementById("soundBtn").innerText =
    soundOn ? "SOUND : ON" : "SOUND : OFF";

document.getElementById("narratorBtn").innerText =
    narratorOn ? "NARRATOR : ON" : "NARRATOR : OFF";
