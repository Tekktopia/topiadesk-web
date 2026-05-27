'use client';

import { useCallback, useEffect, useState } from 'react';

export type PushPermission = 'default' | 'granted' | 'denied' | 'unsupported';

/**
 * Manages Web Push Notification permissions and subscription.
 *
 * Usage:
 *   const { permission, isSubscribed, requestPermission, unsubscribe } = usePushNotifications();
 *
 * When backend is ready:
 *   - Replace VAPID_PUBLIC_KEY with your server's VAPID key
 *   - Replace the `sendSubscriptionToServer` stub with a real API call
 */

// TODO: Replace with your server's VAPID public key
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
  // TODO: Replace with real API call when backend is ready
  console.info('[PWA] Push subscription to register with server:', subscription.toJSON());
  // await fetch('/api/push/subscribe', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(subscription.toJSON()),
  // });
}

async function removeSubscriptionFromServer(endpoint: string): Promise<void> {
  // TODO: Replace with real API call when backend is ready
  console.info('[PWA] Push subscription to remove from server:', endpoint);
  // await fetch('/api/push/unsubscribe', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ endpoint }),
  // });
}

export function usePushNotifications() {
  const [permission, setPermission] = useState<PushPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSupported =
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window;

  useEffect(() => {
    if (!isSupported) {
      setPermission('unsupported');
      return;
    }

    setPermission(Notification.permission as PushPermission);

    // Check if already subscribed
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        setIsSubscribed(!!sub);
      });
    });
  }, [isSupported]);

  const requestPermission = useCallback(async () => {
    if (!isSupported || !VAPID_PUBLIC_KEY) {
      setError('Push notifications are not supported or not configured.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await Notification.requestPermission();
      setPermission(result as PushPermission);

      if (result === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
        await sendSubscriptionToServer(subscription);
        setIsSubscribed(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe to push notifications.');
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async () => {
    if (!isSupported) return;
    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await removeSubscriptionFromServer(subscription.endpoint);
        await subscription.unsubscribe();
        setIsSubscribed(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unsubscribe.');
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    requestPermission,
    unsubscribe,
  };
}
