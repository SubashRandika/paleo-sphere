"use client";

import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Called when rendering fails; receives a function that clears the error and re-mounts the children. */
  onError(retry: () => void): void;
};

/**
 * Catches a model that fails to load (a 404, a corrupt file, a lost WebGL context during load).
 * It sits inside <Canvas> around one model: React error boundaries work in R3F's reconciler too,
 * so a failure removes only that model, not the canvas. The visible error message lives in the
 * DOM overlay (ViewerIsland), not here.
 */
export class ViewerErrorBoundary extends Component<Props, { failed: boolean }> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override componentDidCatch(error: unknown) {
    console.error("[viewer] failed to render the model", error);
    this.props.onError(() => this.setState({ failed: false }));
  }

  override render() {
    return this.state.failed ? null : this.props.children;
  }
}
