import React from 'react';
import loadImage from '../configs/loadImages';
import content from "../content.json";
import InfoCard from './InfoCard';
import NextPageLink from './NextPageLink';

import '../styles/robotsStyle.css';

export default function Robots({ robotsRef }) {
    return (
        <div className="infoBlock" id="robotsBlock" ref={robotsRef}>
            <div className="ourRobot">
                <h2 className="sectionTitle">Types of Robots</h2>
                <p className="robotsIntro">{content.ourRobot}</p>
                {content.robots.map((robot) => (
                    <div className="robot" key={robot.name}>
                        <img src={loadImage('robots', robot.image)} alt={robot.name} className="robotImage" />
                        <InfoCard className="robotDesc" title={robot.name} tag={robot.tag} text={robot.description} />
                    </div>
                ))}
            </div>
            <NextPageLink to="/contact" label="Get In Touch" />
        </div>
    );
}
