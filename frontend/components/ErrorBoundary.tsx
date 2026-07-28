"use client";
import { Component, ReactNode } from "react";
import posthog from "posthog-js";

export class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error?: Error }
> {
  state: { hasError: boolean; error?: Error } = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    posthog.capture("$exception", {
      $exception_message: error.message,
      $exception_type: error.name,
      $exception_stack: error.stack,
      component_stack: info.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div style={{ padding: 24, textAlign: "center" }}>
            <h2>Something went wrong</h2>
            <p>Our team has been notified. Please refresh the page.</p>
            <button onClick={() => this.setState({ hasError: false })}>Try again</button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
