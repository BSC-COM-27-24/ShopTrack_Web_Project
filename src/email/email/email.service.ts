import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {

    //THE EMAIL TRANSPORTER DEFINITION

    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    //THE MESSAGGE ITSELF
    async sendEmail(to: string, subject: string, text: string) {
        try {
            const info = await this.transporter.sendMail({
                from: `"ShopTrack" <${process.env.EMAIL_USER}>`,
                to: to,
                subject: subject,
                text: text,
            });

            console.log('Email sent:', info.response);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }


    //Low stocks alert
}