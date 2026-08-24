"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import "./HangoutsChat.css";

const POLL_MS = 4000;
const NAME_KEY = "drewdella-chat-name";
const OPEN_KEY = "drewdella-chat-open";
const MAX_NAME = 24;
const MAX_BODY = 280;

const AVATAR_COLORS = [
  "#db4437",
  "#f4b400",
  "#0f9d58",
  "#4285f4",
  "#ab47bc",
  "#00acc1",
  "#ff7043",
  "#5c6bc0",
];

function avatarColor(name) {
  const text = String(name || "");
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function initialOf(name) {
  const ch = String(name || "?").trim().charAt(0);
  return ch ? ch.toUpperCase() : "?";
}

function formatTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function HangoutsChat() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);
  const stickBottom = useRef(true);

  useEffect(() => {
    try {
      setOpen(localStorage.getItem(OPEN_KEY) === "1");
      setName(localStorage.getItem(NAME_KEY) || "");
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  const mergeMessages = useCallback((incoming) => {
    setMessages((prev) => {
      const byId = new Map(prev.map((m) => [m.id, m]));
      for (const msg of incoming) {
        if (!msg?.id) continue;
        byId.set(msg.id, msg);
      }
      return Array.from(byId.values()).sort((a, b) =>
        String(a.createdAt || "").localeCompare(String(b.createdAt || ""))
      );
    });
  }, []);

  const loadMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/chat");
      const type = res.headers.get("content-type") || "";
      if (!res.ok || !type.includes("application/json")) {
        throw new Error("Couldn’t load chat right now.");
      }
      const data = await res.json();
      mergeMessages(data.messages || []);
      setStatus("");
    } catch (error) {
      setStatus(error.message || "Couldn’t load chat right now.");
    }
  }, [mergeMessages]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(OPEN_KEY, open ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [open, ready]);

  useEffect(() => {
    if (!ready || !name) return;
    try {
      localStorage.setItem(NAME_KEY, name);
    } catch {
      /* ignore */
    }
  }, [name, ready]);

  const showOpen = ready && open;

  useEffect(() => {
    if (!showOpen) return undefined;

    loadMessages();
    const tick = () => {
      if (document.visibilityState === "hidden") return;
      loadMessages();
    };
    const id = window.setInterval(tick, POLL_MS);
    const onVis = () => {
      if (document.visibilityState === "visible") loadMessages();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [showOpen, loadMessages]);

  useEffect(() => {
    if (!showOpen || !stickBottom.current) return;
    scrollToBottom();
  }, [messages, showOpen, scrollToBottom]);

  const onListScroll = () => {
    const el = listRef.current;
    if (!el) return;
    stickBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
  };

  const send = async (event) => {
    event.preventDefault();
    const cleanedName = name.trim().slice(0, MAX_NAME);
    const cleanedBody = draft.trim().slice(0, MAX_BODY);
    if (!cleanedName) {
      setStatus("Pick a name first.");
      return;
    }
    if (!cleanedBody || sending) return;

    setSending(true);
    setStatus("");
    const tempId = `local-${Date.now()}`;
    const optimistic = {
      id: tempId,
      name: cleanedName,
      body: cleanedBody,
      createdAt: new Date().toISOString(),
      pending: true,
    };
    mergeMessages([optimistic]);
    setDraft("");
    stickBottom.current = true;
    requestAnimationFrame(scrollToBottom);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanedName, body: cleanedBody }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "send failed");

      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.id !== tempId);
        const byId = new Map(withoutTemp.map((m) => [m.id, m]));
        if (data.message?.id) byId.set(data.message.id, data.message);
        return Array.from(byId.values()).sort((a, b) =>
          String(a.createdAt || "").localeCompare(String(b.createdAt || ""))
        );
      });
    } catch (error) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setDraft(cleanedBody);
      setStatus(error.message || "Couldn’t send. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`hangouts${showOpen ? " hangouts--open" : ""}`}>
      {showOpen ? (
        <div className="hangouts-window" role="dialog" aria-label="Chat">
          <div className="hangouts-bar">
            <span className="hangouts-bar-dot" aria-hidden />
            <span className="hangouts-bar-title">Chat</span>
            <button
              type="button"
              className="hangouts-bar-min"
              onClick={() => setOpen(false)}
              aria-label="Minimize chat"
            >
              –
            </button>
          </div>

          <div
            className="hangouts-list"
            ref={listRef}
            onScroll={onListScroll}
          >
            {messages.length === 0 ? (
              <p className="hangouts-empty">
                Nobody’s here yet. Say hi — it sticks around.
              </p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`hangouts-row${msg.pending ? " hangouts-row--pending" : ""}`}
                >
                  <span
                    className="hangouts-avatar"
                    style={{ background: avatarColor(msg.name) }}
                    aria-hidden
                  >
                    {initialOf(msg.name)}
                  </span>
                  <div className="hangouts-bubble">
                    <div className="hangouts-meta">
                      <strong>{msg.name}</strong>
                      <span>{formatTime(msg.createdAt)}</span>
                    </div>
                    <p>{msg.body}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form className="hangouts-compose" onSubmit={send}>
            <input
              className="hangouts-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, MAX_NAME))}
              placeholder="Your name"
              maxLength={MAX_NAME}
              autoComplete="nickname"
              aria-label="Your name"
            />
            <div className="hangouts-input-row">
              <input
                className="hangouts-input"
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value.slice(0, MAX_BODY))}
                placeholder="Send a message"
                maxLength={MAX_BODY}
                autoComplete="off"
                aria-label="Message"
              />
              <button
                type="submit"
                className="hangouts-send"
                disabled={sending || !draft.trim()}
              >
                Send
              </button>
            </div>
            {status ? <p className="hangouts-status">{status}</p> : null}
          </form>
        </div>
      ) : null}

      <button
        type="button"
        className="hangouts-launcher"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Hide chat" : "Open chat"}
        aria-expanded={open}
      >
        <span className="hangouts-launcher-icon" aria-hidden />
        <span className="hangouts-launcher-label">Chat</span>
      </button>
    </div>
  );
}

export default HangoutsChat;
