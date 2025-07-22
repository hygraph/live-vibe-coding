
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import apolloClient from './graphql/apollo-client';
import Layout from './components/Layout';
import SnippetList from './components/SnippetList';
import SnippetForm from './components/SnippetForm';
import SnippetDetail from './components/SnippetDetail';
import './styles/global.css';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        <Layout>
          <Routes>
            {/* Home page - list all snippets */}
            <Route path="/" element={<SnippetList />} />
            
            {/* Create new snippet */}
            <Route path="/new" element={<SnippetForm mode="create" />} />
            
            {/* View single snippet */}
            <Route path="/snippet/:id" element={<SnippetDetail />} />
            
            {/* Edit existing snippet */}
            <Route path="/edit/:id" element={<SnippetForm mode="edit" />} />
            
            {/* 404 Not Found */}
            <Route path="*" element={
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem', 
                color: 'var(--text-secondary)' 
              }}>
                <h2>Page Not Found</h2>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Go Home
                </a>
              </div>
            } />
          </Routes>
        </Layout>
      </Router>
    </ApolloProvider>
  );
}

export default App;
