import AppWrite from "./AppWrite";

export const uploadFile = async (file: File) => {

    const fileExt = file.name.split(".").reverse()[0];
    const fileName = file.name.replaceAll(" ", "").substring(0, 10) + Date.now() + "." + fileExt;

    await AppWrite.upload(file);

    return {
        name: fileName,
    }
}


