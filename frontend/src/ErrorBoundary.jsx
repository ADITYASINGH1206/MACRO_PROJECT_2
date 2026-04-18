import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("React ErrorBoundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#330000', color: '#ffaaaa', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2>React Application Crashed</h2>
          <p><strong>Error:</strong> {this.state.error?.toString()}</p>
          <pre style={{ background: '#000', padding: '1rem', overflow: 'auto', marginTop: '1rem' }}>
            {this.state.errorInfo?.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
