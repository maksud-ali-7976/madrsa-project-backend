import { createElysia } from "src/utils/createElysia";
import { R } from "src/utils/response-helpers";
import { customError } from "src/utils/AppErr";
import Media from "src/models/Media";
import schema, { name } from "./media.schema";
import AppWrite from "src/utils/AppWrite";
import { isAdminAuthenticated } from "src/guard/admin.guard";

export default createElysia({ prefix: "/media" }).guard(
    {
        detail: {
            tags: ["Media"],
        },
        beforeHandle: isAdminAuthenticated,
    },
    (app) =>
        app
            .get(
                "/",
                async () => {
                    const list = await Media.find();
                    return R(`${name} list`, list);
                },
                schema.list,
            )
            .post(
                "/",
                async ({ body, user }) => {
                    console.log("Body", body);
                    const filename = body.file.name;
                    const filesize = body.file.size;

                    const imageUrl = await AppWrite.upload(body.file);

                    const media = await Media.create({
                        filename: filename,
                        file_url: imageUrl,
                        file_size: filesize.toString(),
                    });
                    return R(`${name} created`, media);
                },
                schema.create,
            ),
);