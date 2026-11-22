import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import loadImage from '../configs/loadImages';
import memberPlaceholder from '../assets/members/memberPlaceholder.png';

export default function MemberCard({ name, role, image, email, linkedin, github }) {
    // Only ask the loader when an image is named: it logs on a miss, and a
    // missing photo is the normal case for placeholder members.
    const photo = image ? loadImage('members', image) : null;
    // A photo that fails to load flips to the placeholder; once flipped, a
    // second error is a no-op state update, so a failing placeholder can't loop.
    const [failed, setFailed] = useState(false);
    const src = !photo || failed ? memberPlaceholder : photo;
    const hasLinks = Boolean(email || linkedin || github);

    return (
        <article className="memberCard">
            <div className="memberPhoto">
                <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} />
            </div>
            <h4 className="memberName">{name}</h4>
            <p className="memberRole">{role}</p>
            {hasLinks && (
                <div className="memberLinks">
                    {email && (
                        <a href={`mailto:${email}`} aria-label={`Email ${name}`}>
                            <FontAwesomeIcon icon={faEnvelope} />
                        </a>
                    )}
                    {linkedin && (
                        <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${name} on LinkedIn`}>
                            <FontAwesomeIcon icon={faLinkedin} />
                        </a>
                    )}
                    {github && (
                        <a href={github} target="_blank" rel="noopener noreferrer" aria-label={`${name} on GitHub`}>
                            <FontAwesomeIcon icon={faGithub} />
                        </a>
                    )}
                </div>
            )}
        </article>
    );
}
