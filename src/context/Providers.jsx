import React from 'react';
import { UserProvider } from './UserContext';
import { PlannerProvider } from './PlannerContext';
import { TrainingProvider } from './TrainingContext';
import { NotesProvider } from './NotesContext';
import { FinanceProvider } from './FinanceContext';
import { GoalsProvider } from './GoalsContext';
import { ReflectionProvider } from './ReflectionContext';

export const Providers = ({ children }) => {
    return (
        <UserProvider>
            <PlannerProvider>
                <TrainingProvider>
                    <NotesProvider>
                        <FinanceProvider>
                            <GoalsProvider>
                                <ReflectionProvider>
                                    {children}
                                </ReflectionProvider>
                            </GoalsProvider>
                        </FinanceProvider>
                    </NotesProvider>
                </TrainingProvider>
            </PlannerProvider>
        </UserProvider>
    );
};
