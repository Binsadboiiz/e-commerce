import { useAuth } from "../hooks/useAuth";
import { User, Mail, Shield, Camera, CalendarDays } from "lucide-react";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
    const { user } = useAuth();

    if (!user) {
        return null; // The ProtectedRoute handles the redirect if not logged in
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.titleSection}>
                    <h2 className={styles.title}>My Profile</h2>
                    <p className={styles.subtitle}>Manage your account information and preferences</p>
                </div>
                
                <div className={styles.card}>
                    <div className={styles.banner}></div>
                    <div className={styles.profileContent}>
                        <div className={styles.avatarWrapper}>
                            <div className={styles.avatarContainer}>
                                <div className={styles.avatar}>
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className={styles.avatarPlaceholder}>
                                            <User size={64} />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.cameraOverlay}>
                                    <Camera size={28} className="text-white" />
                                </div>
                            </div>
                        </div>

                        <div className={styles.headerInfo}>
                            <h3 className={styles.userName}>{user.fullName || "Unknown User"}</h3>
                            <div className={styles.roleBadge}>
                                <Shield className={styles.roleIcon} />
                                {user.role || "Member"}
                            </div>
                        </div>

                        <div className={styles.detailsGrid}>
                            <div className={styles.detailCard}>
                                <div className={styles.iconContainer}>
                                    <Mail size={24} />
                                </div>
                                <div className={styles.infoBody}>
                                    <p className={styles.infoLabel}>Email Address</p>
                                    <p className={styles.infoValue}>{user.email || "No email provided"}</p>
                                </div>
                            </div>

                            <div className={styles.detailCard}>
                                <div className={styles.iconContainer}>
                                    <User size={24} />
                                </div>
                                <div className={styles.infoBody}>
                                    <p className={styles.infoLabel}>Full Name</p>
                                    <p className={styles.infoValue}>{user.fullName || "Not set"}</p>
                                </div>
                            </div>
                            
                            <div className={`${styles.detailCard} ${styles.fullWidthRow}`}>
                                <div className={styles.iconContainer}>
                                    <CalendarDays size={24} />
                                </div>
                                <div className={styles.infoBody}>
                                    <p className={styles.infoLabel}>Member Status</p>
                                    <p className={styles.infoValue}>Active User</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.footerSection}>
                            <button className={styles.buttonPrimary}>
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
