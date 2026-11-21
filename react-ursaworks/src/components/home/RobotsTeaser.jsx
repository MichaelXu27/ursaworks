import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import content from '../../content.json';
import loadImage from '../../configs/loadImages';
import Reveal from './Reveal';
import InfoCard from '../InfoCard';
import '../../styles/homeStyle.css';

// The teaser shows one sentence per robot; full descriptions live on /robots.
// Descriptions are authored as an array of paragraphs, so the opening sentence
// is the start of the first one.
const firstSentence = (description) => {
    const text = Array.isArray(description) ? description[0] : description;
    const end = text.indexOf('. ');
    return end === -1 ? text : text.slice(0, end + 1);
};

export default function RobotsTeaser() {
    return (
        <section className="homeSection">
            <Reveal className="homeSectionInner">
                <h2 className="sectionTitle">The Robots</h2>
            </Reveal>
            {content.robots.map((robot, index) => (
                <Reveal
                    key={robot.name}
                    delay={index * 0.15}
                    className={`teaserRobot${index % 2 === 1 ? ' teaserRobotFlipped' : ''}`}
                >
                    <img
                        src={loadImage('robots', robot.image)}
                        alt={robot.name}
                        className="teaserRobotImage"
                    />
                    <InfoCard
                        className="teaserRobotText"
                        title={robot.name}
                        tag={robot.tag}
                        text={firstSentence(robot.description)}
                    />
                </Reveal>
            ))}
            <Reveal className="homeSectionInner">
                <Link className="teaserLink" to="/robots">
                    <span>Meet All The Robots</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                </Link>
            </Reveal>
        </section>
    );
}
