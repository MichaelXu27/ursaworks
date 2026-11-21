import React from 'react';
import loadImage from '../configs/loadImages';
import content from "../content.json";
import Paragraphs from './Paragraphs';
import InfoCard from './InfoCard';
import NextPageLink from './NextPageLink';

import '../styles/aboutStyle.css';

export default function About({ aboutRef }) {

    return (
        <div className="infoBlock" id="aboutBlock" ref={aboutRef}>
            <div className="whatIsArc">
                <h2 className="sectionTitle">{content.arc.title}</h2>
                <Paragraphs className="aboutDesc" text={content.arc.description} />
            </div>
            <div className="ourMission">
                <div className="aboutLeft">
                    <h2 className="sectionTitle">Our Mission</h2>
                    <Paragraphs className="aboutDesc" text={content.intro} />
                    {content.aboutHighlights.map((highlight) => (
                        <InfoCard
                            className="highlightCard"
                            key={highlight.name}
                            title={highlight.name}
                            tag={highlight.tag}
                            text={highlight.description}
                        />
                    ))}
                </div>
                <img src={loadImage('about', content.aboutImage)} alt="About" className="aboutImage" />
            </div>
            <NextPageLink to="/events" label="See All Events" />
        </div>
    );
}
