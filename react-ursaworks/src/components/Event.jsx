import React from 'react';
import loadImage from '../configs/loadImages';
import content from "../content.json";
import locationIcon from '../assets/logoItems/locationIcon.svg';
import calendarIcon from '../assets/logoItems/calendarIcon.svg';
import NextPageLink from './NextPageLink';
import InfoCard from './InfoCard';
import '../styles/eventStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

export default function Event({ eventsRef }) {
    const topEvents = content.events.slice(0, 2);
    const otherEventsToDisplay = content.events.slice(2);
    const seasonsCompeting = new Set(content.events.map((event) => event.date.match(/\d{4}/)?.[0])).size;
    const stats = [
        { value: content.events.length, label: 'Events Attended' },
        { value: seasonsCompeting, label: 'Seasons Competing' },
        { value: content.competitions.length, label: 'Annual Competitions' },
    ];

    return (
        <div className="infoBlock" id="eventsBlock" ref={eventsRef}>
            <div className="eventMainCard">
                <div className="eventTopRow">
                    <div className="robomaster">
                        <h2 className="sectionTitle">Our Events</h2>
                        <div className="eventStats">
                            {stats.map((stat) => (
                                <div className="eventStat" key={stat.label}>
                                    <strong>{stat.value}</strong>
                                    <span>{stat.label}</span>
                                </div>
                            ))}
                        </div>
                        <p className="robomasterDesc">
                            We have two primary events that we attend each year.
                        </p>
                        {content.competitions.map((competition) => (
                            <InfoCard
                                className="competitionCard"
                                key={competition.name}
                                title={competition.name}
                                tag={competition.tag}
                                text={competition.description}
                            />
                        ))}
                        <a className="moreAboutLink" href={content.contact.arcWebsite} target="_blank" rel="noopener noreferrer">
                            <span>More About ARC</span>
                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                        </a>
                    </div>

                    <div className="topEvent">
                        {topEvents.map((event) => (
                            <div className="eventInfo" key={event.name}>
                                <div className="eventImage">
                                    <img src={loadImage('events', event.image)} alt={event.name} className="eventPhoto" />
                                    <span>{event.date}</span>
                                </div>
                                <h5>{event.name}</h5>
                                {event.result && <span className="eventResult">{event.result}</span>}
                                <div className="eventLocationContent">
                                    <img src={locationIcon} alt="Location Icon" className="locationIcon" />
                                    <p>{event.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="eventsContent">
                    <div className="otherEvents">
                        {otherEventsToDisplay.map((event) => (
                            <div className="otherEventInfo" key={event.name}>
                                <img src={loadImage('events', event.image)} alt={event.name} className="otherEventPhoto" />
                                <div className="otherEventText">
                                    <h5>{event.name}</h5>
                                    {event.result && <span className="eventResult">{event.result}</span>}
                                    <div className="otherEventLocation">
                                        <img src={locationIcon} alt="Location Icon" className="miniIcon" />
                                        <p>{event.location}</p>
                                    </div>
                                    <div className="otherEventDate">
                                        <img src={calendarIcon} alt="Calendar Icon" className="miniIcon" />
                                        <p>{event.date}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <NextPageLink to="/robots" label="Meet All The Robots" />
        </div>
    );
}
