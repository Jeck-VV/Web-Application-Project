import { useContext } from 'react';
import LanguageContext from './LanguageContext.jsx';
import gameTranslations from './GameTranslations.js';
import './css/RulesPage.css';

export function RulesPage() {
    const { language } = useContext(LanguageContext);
    const tx = gameTranslations[language];

    return (
        <div className="rules-page">
            <h1 className="rules-page-title">{tx.rulesTitle}</h1>

            {tx.rulesSections.map((section) => (
                <div key={section.id} className="rules-section">
                    <h2 className="rules-section-title">{section.heading}</h2>

                    {section.intro && <p>{section.intro}</p>}

                    {section.phases ? (
                        <>
                            <ul className="rules-phases">
                                {section.phases.map((phase) => (
                                    <li key={phase.label} className="rules-phase-item">
                                        <span className="rules-phase-badge">{phase.label}</span>
                                        <p>{phase.text}</p>
                                    </li>
                                ))}
                            </ul>
                            {section.validity && (
                                <div className="rules-validity">{section.validity}</div>
                            )}
                        </>
                    ) : (
                        <p>{section.body}</p>
                    )}
                </div>
            ))}

            <div className="rules-warning d-flex align-items-center justify-content-center">
                <span className="rules-warning-icon">⚠️</span>
                <span>{tx.rulesWarning}</span>
            </div>

            <div className='wish'>
                <h1> {tx.rulesHaveFun} </h1>
            </div>
        </div>
    );
}