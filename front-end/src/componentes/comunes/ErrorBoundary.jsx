import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    console.error("Error capturado:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Algo salió mal</h2>
          <p>Por favor, intenta recargar la página</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Recargar página
          </button>
          {import.meta.env.MODE === "development" && this.state.errorInfo && (
            <details style={{ whiteSpace: "pre-wrap", marginTop: "1rem" }}>
              <summary>Detalles del error</summary>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
