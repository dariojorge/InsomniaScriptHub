interface EnvsData {
    envs: Env[];
    additionalCmd: AdditionalCmd[];
}

interface Env {
    type: string;
    envVars: EnvVar[];
}

interface EnvVar {
    key: string;
    value: string;
}

interface AdditionalCmd {
    type: string;
    value: string;
    cmd: string;
}