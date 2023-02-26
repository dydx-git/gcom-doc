import { User } from "$lib/models/user";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.validate();

    if (session) throw redirect(302, "/");
};


export const actions: Actions = {
    default: async ({ locals }) => {
        const { username, password } = locals.form_data;
        try {
            const session = await new User().login(username, password);
            locals.setSession(session);
        } catch (error) {
            console.error(error);
            return fail(400);
        }
    }
};