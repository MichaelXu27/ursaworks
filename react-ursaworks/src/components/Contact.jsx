import React from 'react';
import content from "../content.json";
import emailIcon from '../assets/logoItems/emailIcon.svg';
import insIcon from '../assets/logoItems/insIcon.svg';
import '../styles/contactStyle.css';

export default function Contact() {
    const { email, instagramHandle, instagramUrl } = content.contact;

    return (
        <div className="infoBlock" id="contactBlock">
            <h2 className="sectionTitle">Get in Touch</h2>
            <p className="contactIntro">
                Not sure who to ask? Email the club or message us on Instagram.
            </p>
            <div className="contactLinks">
                <a className="contactLink" href={`mailto:${email}`}>
                    <img src={emailIcon} alt="" aria-hidden="true" />
                    <span>{email}</span>
                </a>
                <a className="contactLink" href={instagramUrl} target="_blank" rel="noopener noreferrer">
                    <img src={insIcon} alt="" aria-hidden="true" />
                    <span>{instagramHandle}</span>
                </a>
            </div>
        </div>
    );
}
