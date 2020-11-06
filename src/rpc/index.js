import React, {useEffect, useState} from 'react';
import axios from 'axios';

const RPC = () => {

    const requestUrl = 'https://raw.githubusercontent.com/alex/nyt-2020-election-scraper/master/results.json';
    const loadingMessage = 'Loading...';

    const [rawData, setRawData] = useState(null);
    const [outlookDem, setOutlookDem] = useState(null);
    const [outlookRep, setOutlookRep] = useState(null);
    const [states, setStates] = useState(null);

    useEffect(() => {
        if (rawData !== null) {
            setStates(rawData.data.races);
            setOutlookDem([rawData.data.party_control[1].parties.democrat.percent,
            rawData.data.party_control[1].parties.democrat.count]);
            setOutlookRep([rawData.data.party_control[1].parties.republican.percent,
                rawData.data.party_control[1].parties.republican.count]);
        }
    }, [rawData]);

    useEffect(() => {
        const interval = setInterval(() => {
            getRequest();
        }, 60000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (!rawData) {
            getRequest();
        }
    })

    const getRequest = async () => {
        console.log('Data retrieved')
        const response = await axios.get(requestUrl);
        const data = response.data;
        setRawData(data)
    }

    const COLOR_CODES = {
        'solid-dem': 'bg-blue-500',
        'likely-dem': 'bg-blue-400',
        'lean-dem': 'bg-blue-300',
        'tossup': 'bg-gray-100',
        'lean-rep': 'bg-red-300',
        'likely-rep': 'bg-red-400',
        'solid-rep': 'bg-red-500',
        'democrat': 'bg-blue-500',
        'republican': 'bg-red-500'
    }

    const CONVERTED_TEXT = {
        'solid-dem': 'Solid Democrat',
        'likely-dem': 'Likely Democrat',
        'lean-dem': 'Lean Democrat',
        'tossup': 'Tossup',
        'lean-rep': 'Lean Republican',
        'likely-rep': 'Likely Republican',
        'solid-rep': 'Solid Republican',
        'republican': 'Republican Win',
        'democrat': 'Democrat Win'
    }

    const States = () => {
        if (states) {
            return (
                <div>
                    {states.map(state => {

                        const name = state.state_name;

                        const result = state.result ? state.leader_party_id : state.race_rating;

                        const expectationsTextShort = state.expectations_text_short;

                        const reportingDisplay = state.reporting_display;

                        const colorClass = COLOR_CODES[result];

                        const lastUpdated = state.last_updated;

                        return (
                            <div className={'flex flex-col text-center p-2 rounded m-1 ' + colorClass}>
                                <p className={'font-bold'}>
                                    {`${name}:`}
                                </p>
                                <p>
                                    {CONVERTED_TEXT[result]}
                                </p>
                                <p>
                                    {reportingDisplay}
                                </p>
                                <p>
                                    {expectationsTextShort}
                                </p>
                                <p>
                                    {`Last Updated: ${Date(lastUpdated).toLocaleString()}`}
                                </p>
                            </div>

                        )

                        return null
                    }
                        )}
                </div>
            )
        }

        return null
    }

    return (
        <div className={'bg-gray-100'}>
            <div className={'bg-gray-300 rounded m-1 text-center'}>
                <p>
                    {'Outlook: '}
                </p>
                <div className={' flex justify-around flex-row'}>     
                    <div className={'flex flex-col'}>
                        <p className={'font-medium'}>
                            {'Biden:'}
                        </p>
                        <p>
                            {outlookDem ? `${outlookDem[0]}%` : loadingMessage}
                        </p>
                        <p>
                            {outlookDem ? `${outlookDem[1]} Votes` : loadingMessage}
                        </p>
                    </div>
                    <div className={'flex flex-col'}>
                        <p className={'font-medium'}>
                            {'Trump:'}
                        </p>
                        <p>
                            {outlookRep ? `${outlookRep[0]}%` : loadingMessage}
                        </p>
                        <p>
                            {outlookRep ? `${outlookRep[1]} Votes` : loadingMessage}
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <States />
            </div>
            <button onClick={getRequest}>{'Refresh'}</button>
        </div>

    )
}

export default RPC;