"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const API_URL = "https://backend-albarqy.onrender.com/api";

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return {
      error: "الرجاء إدخال البريد الإلكتروني وكلمة المرور",
    };
  }

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ email, password }),
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      return { error: "استجابة غير صالحة من السيرفر" };
    }

    if (!response.ok) {
      return {
        error: data.message || "فشل تسجيل الدخول، تأكد من صحة البيانات",
      };
    }

    const tokenData = data.token?.original;
    const accessToken = tokenData?.access_token;

    if (accessToken) {
      const userRole = data.user?.role;

      if (userRole !== "admin") {
        return {
          error: "عذراً، غير مسموح لك بالوصول للوحة التحكم. يجب أن تكون مديراً (Admin).",
        };
      }

      const cookieStore = await cookies();

      cookieStore.set("auth_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: tokenData.expires_in || 3600,
        path: "/",
      });

      cookieStore.set("auth_token_type", tokenData.token_type || "bearer", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: tokenData.expires_in || 3600,
        path: "/",
      });

      cookieStore.set("user_role", userRole, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: tokenData.expires_in || 3600,
        path: "/",
      });

      revalidatePath("/dashboard", "layout");

    } else {
      return {
        error: "لم يتم استلام توكن من السيرفر",
      };
    }

  } catch (error) {
    console.error("Login error:", error);
    return {
      error: "حدث خطأ أثناء الاتصال بالخادم",
    };
  }

  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("auth_token_type");
  cookieStore.delete("user_role");

  revalidatePath("/", "layout");
  redirect("/");
}

export async function register(prevState: any, formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const password_confirmation = formData.get("password_confirmation");

  if (!name || !email || !password || !password_confirmation) {
    return {
      error: "الرجاء إدخال جميع البيانات المطلوبة",
    };
  }

  if (password !== password_confirmation) {
    return {
      error: "كلمة المرور وتأكيد كلمة المرور غير متطابقين",
    };
  }

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ name, email, password, password_confirmation }),
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      return { error: "استجابة غير صالحة من السيرفر" };
    }

    if (!response.ok) {
      return {
        error: data.message || "فشل التسجيل، قد يكون البريد الإلكتروني مستخدم مسبقاً",
      };
    }

    // Success response contains "message" and "user", no token.
    // We redirect to login page with a success query param.

  } catch (error) {
    console.error("Register error:", error);
    return {
      error: "حدث خطأ أثناء الاتصال بالخادم",
    };
  }

  redirect("/login?registered=true");
}