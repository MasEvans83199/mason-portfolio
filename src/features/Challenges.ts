export interface Challenge {
    name: string;
    description: string;
    language: string;
    testCases: { input: any; expectedOutput: any }[];
    validate: (userCode: string) => { success: boolean; message: string };
}

const reverseString: Challenge = {
    name: "reverseString",
    description: "Write a function called 'reverseString' that takes a string as input and returns the reversed string.",
    language: "JavaScript",
    testCases: [
        { input: "hello", expectedOutput: "olleh" },
        { input: "radar", expectedOutput: "radar" },
        { input: "racecar", expectedOutput: "racecar" },
    ],
    validate: (userCode: string) => {
        try {
            const userFunction = new Function(`
                ${userCode}
                return reverseString;
            `)();

            for (const { input, expectedOutput } of reverseString.testCases) {
                const userOutput = userFunction(input);
                if (userOutput !== expectedOutput) {
                    return {
                        success: false,
                        message: `Failed on input "${input}". Expected "${expectedOutput}", but got "${userOutput}".`
                    };
                }
            }
            return { success: true, message: "All test cases passed!" };
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: `Error: ${error.message}` };
            } else {
                return { success: false, message: "An unknown error occurred" };
            }
        }
    }
};

const fizzBuzz: Challenge = {
    name: "fizzBuzz",
    description: "Write a function called 'fizzBuzz' that takes a number n and returns an array of strings from 1 to n, but for multiples of 3 use 'Fizz' instead of the number, for multiples of 5 use 'Buzz', and for multiples of both 3 and 5 use 'FizzBuzz'.",
    language: "JavaScript",
    testCases: [
        { 
            input: 15, 
            expectedOutput: [
                "1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", 
                "11", "Fizz", "13", "14", "FizzBuzz"
            ]
        },
        { 
            input: 5, 
            expectedOutput: ["1", "2", "Fizz", "4", "Buzz"]
        },
    ],
    validate: (userCode: string) => {
        try {
            const userFunction = new Function(`
                ${userCode}
                return fizzBuzz;
            `)();

            for (const { input, expectedOutput } of fizzBuzz.testCases) {
                const userOutput = userFunction(input);
                if (JSON.stringify(userOutput) !== JSON.stringify(expectedOutput)) {
                    return {
                        success: false,
                        message: `Failed on input ${input}. Expected ${JSON.stringify(expectedOutput)}, but got ${JSON.stringify(userOutput)}.`
                    };
                }
            }
            return { success: true, message: "All test cases passed!" };
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: `Error: ${error.message}` };
            } else {
                return { success: false, message: "An unknown error occurred" };
            }
        }
    }
};

export const challenges: { [key: string]: Challenge } = {
    reverseString,
    fizzBuzz,
};

export const listChallenges = (): string[] => {
    return Object.entries(challenges).map(([_key, challenge], index) => 
        `${index + 1}. ${challenge.name} (${challenge.language}): ${challenge.description}`
    );
}