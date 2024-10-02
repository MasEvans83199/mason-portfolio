import React, { useState, useEffect, useRef } from 'react';
import { adventureGame } from './AdventureGame';
import { quotes } from './quotes';
import resumePDF from '../assets/MasonEvansResume.pdf';
import '../styles/Terminal.css';

interface GameState {
    number: number
    attempts: number;
    won: boolean;
}

interface AdventureGameState {
    currentRoom: string;
    inventory: string[];
    flags: { [key: string]: boolean };
}

const Terminal: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);
    const [gameActive, setGameActive] = useState(false);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [enteringKonami, setEnteringKonami] = useState(false);
    const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    const [adventureGameState, setAdventureGameState] = useState<AdventureGameState | null>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        displayWelcomeMessage();
    }, []);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);
    
    useEffect(() => {
        const terminalDiv = document.querySelector('.terminal') as HTMLElement;
        if (terminalDiv) {
            terminalDiv.focus();
        }
    }, []);
    
    const displayWelcomeMessage = () => {
        const asciiArt = [
          "  __  __                         _____                        ",
          " |  \\/  | __ _ ___  ___  _ __   | ____|_   ____ _ _ __  ___   ",
          " | |\\/| |/ _` / __|/ _ \\| '_ \\  |  _| \\ \\ / / _` | '_ \\/ __|  ",
          " | |  | | (_| \\__ \\ (_) | | | | | |___ \\ V / (_| | | | \\__ \\  ",
          " |_|  |_|\\__,_|___/\\___/|_| |_| |_____| \\_/ \\__,_|_| |_|___/  ",
          "                                                              ",
          " ____            _    __       _ _                            ",
          "|  _ \\ ___  _ __| |_ / _| ___ | (_) ___                       ",
          "| |_) / _ \\| '__| __| |_ / _ \\| | |/ _ \\                      ",
          "|  __/ (_) | |  | |_|  _| (_) | | | (_) |                     ",
          "|_|   \\___/|_|   \\__|_|  \\___/|_|_|\\___/                      ",
          "",
          "Welcome to Mason Evans' Portfolio Terminal.",
          "Type 'help' to see available commands.",
          ""
        ].map(line => line.replace(/ /g, '\u00A0'));
        
        setOutput(asciiArt);
      };      
      
      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
      };
    
      const handleInputSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        processCommand(input);
        setInput('');
      };
      
    const typeOutput = (text: string, delay: number) => {
        const lines = text.split('\n');
        lines.forEach((line, index) => {
          setTimeout(() => {
            setOutput(prev => [...prev, line]);
          }, delay * index);
        });
      };
  
      const processCommand = (cmd: string) => {
        typeOutput(`> ${cmd}`, 100);
    
        if (enteringKonami) {
            setOutput(prev => [...prev, "Please finish entering the Konami code.", ""]);
            return;
        }
    
        if (adventureGameState) {
            if (cmd.toLowerCase() === 'adventure exit') {
                setAdventureGameState(null);
                setOutput(prev => [...prev, "Exiting Coder's Quest. Thanks for playing!", ""]);
            } else if (cmd.toLowerCase() === 'adventure help') {
                displayAdventureHelp();
            } else {
                processAdventureCommand(cmd);
            }
            return;
        }
    
        const [mainCommand, ...args] = cmd.toLowerCase().split(' ');
    
        switch (mainCommand) {
            case 'launch':
                const projectNumber = parseInt(args[0]);
                openProject(projectNumber);
                break;
            case 'help':
            case 'h':
                displayHelp();
                break;
            case 'about':
            case 'a':
                displayAbout();
                break;
            case 'projects':
            case 'p':
                displayProjects();
                break;
            case 'skills':
            case 's':
                displaySkills();
                break;
            case 'contact':
            case 'c':
                displayContact();
                break;
            case 'resume':
            case 'r':
                openResume();
                break;
            case 'clear':
            case 'clr':
                setOutput([]);
                break;
            case 'easter':
                if (args[0] === 'egg') displayEasterEgg();
                break;
            case 'play':
                if (args[0] === 'game') startGame();
                if (args[0] === 'adventure') startAdventureGame();
                break;
            case 'konami':
                displayKonamiCode();
                break;
            case 'theme':
                changeTheme(args[0]);
                break;
            case 'quote':
                displayRandomQuote();
                break;
            default:
                if (gameActive) {
                    processGameCommand(cmd);
                } else {
                    setOutput(prev => [...prev, 'Command not recognized. Type "help" for available commands.', '']);
                }
        }
    };
    
    const displayHelp = () => {
        setOutput(prev => [...prev,
            'Available commands:',
            '  about (a)   - Display information about me',
            '  projects (p) - Show my projects',
            '  skills (s)  - List my skills',
            '  contact (c) - Display contact information',
            '  resume (r)  - Open my resume in a new tab',
            '  launch <project number> - Open a project in a new tab',
            '  clear (clr) - Clear the terminal',
            '  play game  - Start a number guessing game',
            '  konami     - Will not unlock 1999 mode',
            '  theme <dark/light> - Change terminal theme',
            '  quote      - Display a random programming quote',
            '  play adventure - Start the Coder\'s Quest adventure game',
            '    In the adventure, you can use commands like:',
            '    - adventure help',
            '    - adventure exit',            
            ''
        ]);
    };

    const displayAdventureHelp = () => {
        setOutput(prev => [...prev,
            "Coder's Quest Commands:",
            "  look [object]  - Examine your surroundings or a specific object",
            "  go [direction] - Move in a specified direction (north, south, east, west, up, down)",
            "  take [item]    - Pick up an item",
            "  use [item]     - Use an item in your inventory",
            "  inventory      - Check what items you're carrying",
            "  adventure exit - Exit the game",
            ""
        ]);
    };
  
    const displayAbout = () => {
      setOutput(prev => [...prev,
        'Hi, I\'m [Your Name]!',
        'I\'m a Full-Stack Developer passionate about creating innovative web applications.',
        'With a strong foundation in modern web technologies, I love turning ideas into reality.',
        ''
      ]);
    };
  
    const displayProjects = () => {
        setOutput(prev => [...prev,
          'My Projects:',
          '1. ReactJS Bird App',
          '   A Twitter-like application for bird enthusiasts',
          '   Technologies: React, Node.js, MongoDB',
          '   Link: https://www.beaktobasics.com/',
          '',
          '2. Article Sharing Web App',
          '   A platform for sharing and discussing articles',
          '   Technologies: Vue.js, Express, PostgreSQL',
          '   Link: https://article-share.example.com',
          '',
          '3. Graffiti Wall Tagging Web App',
          '   An interactive digital graffiti wall',
          '   Technologies: React, Canvas API, Firebase',
          '   Link: https://graffiti-wall.example.com',
          '',
          'To open a project, type "open <project number>" (e.g., "open 1")',
          ''
        ]);
      };

    const openProject = (projectNumber: number) => {
        const projects = [
          'https://www.beaktobasics.com',
          'https://article-share.example.com',
          'https://tagmaster.netlify.app'
        ];
        
        if (projectNumber >= 1 && projectNumber <= projects.length) {
          window.open(projects[projectNumber - 1], '_blank');
          setOutput(prev => [...prev, `Launching project ${projectNumber} in a new tab...`, '']);
        } else {
          setOutput(prev => [...prev, 'Invalid project number. Please try again.', '']);
        }
      };
  
    const displaySkills = () => {
      setOutput(prev => [...prev,
        'My Skills:',
        '- Frontend: JavaScript, TypeScript, React, Vue.js, HTML5, CSS3',
        '- Backend: Node.js, Express, Python, Django',
        '- Databases: MongoDB, PostgreSQL, MySQL',
        '- Tools: Git, Docker, CI/CD',
        ''
      ]);
    };
  
    const displayContact = () => {
      setOutput(prev => [...prev,
        'Contact Information:',
        'Email: masevans83199@gmail.com',
        'GitHub: github.com/masevans83199',
        'LinkedIn: linkedin.com/in/mas_evans',
        ''
      ]);
    };

    const openResume = () => {
        window.open(resumePDF, '_blank');
        setOutput(prev => [...prev, "Opening your resume...", ""]);
    };

    const displayEasterEgg = () => {
        const easterEgg = [
          "You found a secret!",
          "Here's a fun fact: The first computer bug was an actual bug.",
          "In 1947, Grace Hopper found a moth causing issues in the Harvard Mark II computer.",
          "This incident popularized the term 'debugging' in computer programming.",
          ""
        ];
        setOutput(prev => [...prev, ...easterEgg]);
      };

      const handleKeyDown = (e: React.KeyboardEvent) => {
        if (enteringKonami) {
            e.preventDefault();
            const newSequence = [...konamiSequence, e.key];
            setKonamiSequence(newSequence);
            
            if (newSequence.length === konamiCode.length) {
                checkKonamiCode(newSequence);
                setEnteringKonami(false);
            }
        }
    };

    const checkKonamiCode = (sequence: string[]) => {
        if (sequence.join(',') === konamiCode.join(',')) {
            displayKonamiSuccess();
        } else {
            setOutput(prev => [...prev, "Incorrect sequence. Konami code entry failed.", ""]);
        }
        setKonamiSequence([]);
    };

    const displayKonamiCode = () => {
        setEnteringKonami(true);
        setKonamiSequence([]);
        setOutput(prev => [...prev,
            "Enter the Konami code:",
            "Use arrow keys for ↑↓←→, and 'b' and 'a' keys.",
            ""
        ]);
    };

    const displayKonamiSuccess = () => {
        const konamiMessage = [
            "⬆️ ⬆️ ⬇️ ⬇️ ⬅️ ➡️ ⬅️ ➡️ 🅱️ 🅰️",
            "Congratulations! You've unlocked the Konami Code!",
            "Here's a virtual high five! ✋",
            "30 lives added! (Just kidding, this is a portfolio)",
            ""
        ];
        setOutput(prev => [...prev, ...konamiMessage]);
    };
      
      const startGame = () => {
        setGameActive(true);
        setGameState({
          number: Math.floor(Math.random() * 100) + 1,
          attempts: 0,
          won: false
        });
        setOutput(prev => [...prev,
          "Let's play a number guessing game!",
          "I'm thinking of a number between 1 and 100.",
          "Type a number to guess, or 'quit' to end the game.",
          ""
        ]);
      };
      
      const processGameCommand = (cmd: string) => {
        if (!gameState) return;
      
        if (cmd.toLowerCase() === 'quit') {
          setGameActive(false);
          setGameState(null);
          setOutput(prev => [...prev, "Game ended. Thanks for playing!", ""]);
          return;
        }
      
        const guess = parseInt(cmd);
        if (isNaN(guess)) {
          setOutput(prev => [...prev, "Please enter a valid number or 'quit'.", ""]);
          return;
        }
      
        setGameState(prev => prev ? { ...prev, attempts: prev.attempts + 1 } : null);
      
        if (guess === gameState.number) {
          setOutput(prev => [...prev,
            `Congratulations! You guessed the number ${gameState.number} in ${gameState.attempts + 1} attempts!`,
            "Game over. Type 'play game' to play again.",
            ""
          ]);
          setGameActive(false);
          setGameState(null);
        } else if (guess < gameState.number) {
          setOutput(prev => [...prev, "Too low! Try again.", ""]);
        } else {
          setOutput(prev => [...prev, "Too high! Try again.", ""]);
        }
      };
      
      const changeTheme = (theme: string) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
            setOutput(prev => [...prev, "Theme changed to dark.", ""]);
        } else if (theme === 'light') {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
            setOutput(prev => [...prev, "Theme changed to light.", ""]);
        } else {
            setOutput(prev => [...prev, "Unknown theme. Use 'dark' or 'light'.", ""]);
        }
    };

    const startAdventureGame = () => {
        setGameActive(true);
        setAdventureGameState({ currentRoom: 'start', inventory: [], flags: {} });
        const startMessage = adventureGame.rooms.start.description;
        setOutput(prev => [...prev, "Starting Coder's Quest...", startMessage, ""]);
    };
    
    const processAdventureCommand = (cmd: string) => {
        if (!adventureGameState) return;
    
        if (cmd.toLowerCase() === 'adventure help') {
            displayAdventureHelp();
            return;
        }
    
        const { newState, message } = adventureGame.processCommand(adventureGameState, cmd);
        setAdventureGameState(newState as AdventureGameState);
        setOutput(prev => [...prev, message, ""]);
    
        if (newState.currentRoom === 'end') {
            setAdventureGameState(null);
            setOutput(prev => [...prev, "Congratulations! You've completed Coder's Quest!", ""]);
        }
    };    

    const displayRandomQuote = () => {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setOutput(prev => [...prev, randomQuote, ""]);
    };

      return (
        <div className="terminal" onKeyDown={handleKeyDown} tabIndex={0}>
            <div className="terminal-header">
                <div className="terminal-button red"></div>
                <div className="terminal-button yellow"></div>
                <div className="terminal-button green"></div>
            </div>
            <div className="terminal-window">
                <div className="terminal-output" ref={outputRef}>
                    {output.map((line, index) => (
                        <div key={index} className="output-line typing-animation">{line}</div>
                    ))}
                </div>
                <form onSubmit={handleInputSubmit} className="terminal-input">
                    <span className="prompt">&gt;</span>
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        ref={inputRef}
                        autoFocus
                    />
                </form>
            </div>
        </div>
    );
};

export default Terminal;