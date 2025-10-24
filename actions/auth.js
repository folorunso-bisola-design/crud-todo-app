import { authClient } from '@/lib/auth-client';


/**
 * Get the current authenticated user
 * NOTE: This is a client-side function. For client components, use the useSession hook instead.
 * @returns {Promise<{user: any, error: any}>}
 */
export const getCurrentUser = async () => {
    try {
        const { data, error } = authClient.useSession();

        if (error) {
            console.error("Error fetching current user:", error);
            return { user: null, error };
        }

        // if (!data) {
        //     return { user: null, error: null };
        // }

        return { user: data, error: null };
    } catch (error) {
        console.error("Error fetching current user:", error);
        return { user: null, error };
    }
};


/**
 * Sign in function for email/password authentication
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {object} callbacks - Optional callback functions
 * @returns {Promise<{data: any, error: any}>}
 */
export const signIn = async (email, password, callbacks = {}) => {
    const { onRequest, onSuccess, onError } = callbacks;

    try {
        // Call onRequest callback if provided
        if (onRequest) {
            onRequest();
        }

        const { data, error } = await authClient.signIn.email({
            email,
            password,
            callbackURL: "/dashboard" // Redirect after successful sign in
        });

        if (error) {
            // Call onError callback if provided
            if (onError) {
                onError({ error });
            }
            return { data: null, error };
        }

        // Call onSuccess callback if provided
        if (onSuccess) {
            onSuccess({ data });
        }

        return { data, error: null };
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Sign in failed";

        // Call onError callback if provided
        if (onError) {
            onError({ error: { message: errorMessage } });
        }

        return { data: null, error: { message: errorMessage } };
    }
};


/**
 * Sign up function for email/password authentication
 * @param {string} email - User's email address
 * @param {string} password - User's password (min 8 characters)
 * @param {string} name - User's display name
 * @param {object} callbacks - Optional callback functions
 * @returns {Promise<{data: any, error: any}>}
 */
export const signUp = async (email, password, name, callbacks = {}) => {
    const { onRequest, onSuccess, onError } = callbacks;

    try {
        // Call onRequest callback if provided
        if (onRequest) {
            onRequest();
        }

        const { data, error } = await authClient.signUp.email({
            email,
            password,
            name,
            callbackURL: "/"
        });

        if (error) {
            // Call onError callback if provided
            if (onError) {
                onError({ error });
            }
            return { data: null, error };
        }

        // Call onSuccess callback if provided
        if (onSuccess) {
            onSuccess({ data });
        }

        return { data, error: null };
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Sign up failed";

        // Call onError callback if provided
        if (onError) {
            onError({ error: { message: errorMessage } });
        }

        return { data: null, error: { message: errorMessage } };
    }
};


/**
 * Sign out function
 * @param {object} callbacks - Optional callback functions
 * @returns {Promise<void>}
 */
export const signOut = async (callbacks = {}) => {
    const { onRequest, onSuccess, onError } = callbacks;

    try {
        // Call onRequest callback if provided
        if (onRequest) {
            onRequest();
        }

        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    if (onSuccess) {
                        onSuccess();
                    }
                },
                onError: (ctx) => {
                    if (onError) {
                        onError(ctx);
                    }
                }
            }
        });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Sign out failed";

        if (onError) {
            onError({ error: { message: errorMessage } });
        }
    }
};


