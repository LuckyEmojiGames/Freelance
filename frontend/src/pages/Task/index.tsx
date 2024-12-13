import React, { useState } from 'react';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import Page4 from './Page4';
import { TaskProvider } from '../../components/contexts/TaskContext';

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return <Page1 setCurrentPage={setCurrentPage} />;
      case 2:
        return <Page2 setCurrentPage={setCurrentPage} />;
      case 3:
        return <Page3 setCurrentPage={setCurrentPage} />;
      case 4:
        return <Page4 setCurrentPage={setCurrentPage} />;
      default:
        return <Page1 setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <TaskProvider>
        {renderPage()}
    </TaskProvider>
  );
};

export default App;
