interface FileBaseI {
    publicId: string;
    url: string;
    originalName: string;
    fileType: string;
    size: number;
}

// select
export interface FileI extends FileBaseI {
    id: number;
}

// create or update
export interface FileReqI extends FileBaseI {}

export interface FileResI extends FileI {}