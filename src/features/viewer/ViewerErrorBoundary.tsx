"use client";

import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Called when rendering fails; receives a function that clears the error and re-mounts the children. */
  onError(retry: () => void): void;
};

/**
 * Catches failures inside the canvas (a 404 model, a corrupt file, a lost WebGL context during load).
 * R3F re-throws errors from inside <Canvas> into the surrounding React tree, so a normal
 * error boundary around the canvas receives them. The visible error message lives in the
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
