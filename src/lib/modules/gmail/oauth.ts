import { google } from 'googleapis';
import type { Credentials } from 'google-auth-library';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as credentials from './includes/credentials.json';
import { fileURLToPath } from 'url';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify', 'https://www.googleapis.com/auth/gmail.compose', 'https://www.googleapis.com/auth/gmail.send'];

export class GmailAuth {
    private oAuth2Client: OAuthClient
    private tokenPath: string
    private __filename = fileURLToPath(import.meta.url);
    private __dirname = path.dirname(this.__filename);
    private companyId: number

    constructor(companyId: number) {
        this.oAuth2Client = this.getOAuth2Client();

        this.tokenPath = path.join(this.__dirname, `./includes/${companyId}-token.json`)
        this.companyId = companyId
    }

    public async authorize() {
        // check if the token already exists
        const exists = await fs.exists(this.tokenPath)
        const token = exists ? await fs.readFile(this.tokenPath, 'utf8') : ''

        if (token) {
            this.authenticate(JSON.parse(token))
            return true
        }

        return false
    }

    public async getNewToken() {
        return this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: SCOPES,
            state: JSON.stringify({ companyId: this.companyId })
        })
    }

    public async saveToken(token: Credentials) {
        await fs.writeFile(this.tokenPath, JSON.stringify(token))
    }

    public getOAuth2Client() {
        const GOOGLE_CLIENT_ID = credentials.web.client_id
        const GOOGLE_CLIENT_SECRET = credentials.web.client_secret
        const GOOGLE_CALLBACK_URL = credentials.web.redirect_uris[0]

        const oAuth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL)
        return oAuth2Client
    }


    private authenticate(token: Credentials) {
        this.oAuth2Client.setCredentials(token)
        google.options({
            auth: this.oAuth2Client
        })
    }
}

type OAuthClient = ReturnType<GmailAuth['getOAuth2Client']>