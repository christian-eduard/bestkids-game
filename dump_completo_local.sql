--
-- PostgreSQL database dump
--

\restrict xVroHdJnDoOIZnWMK8fBAQPvPw2ewguYGzbHoQ9YuyLFgcnQCWt34UuJOQeVq3Y

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: achievements_category_enum; Type: TYPE; Schema: public; Owner: bestkids_user
--

CREATE TYPE public.achievements_category_enum AS ENUM (
    'exercises',
    'streak',
    'points',
    'level',
    'perfect',
    'speed',
    'explorer'
);


ALTER TYPE public.achievements_category_enum OWNER TO bestkids_user;

--
-- Name: achievements_type_enum; Type: TYPE; Schema: public; Owner: bestkids_user
--

CREATE TYPE public.achievements_type_enum AS ENUM (
    'bronze',
    'silver',
    'gold',
    'diamond',
    'special'
);


ALTER TYPE public.achievements_type_enum OWNER TO bestkids_user;

--
-- Name: adaptive_progress_currentlevel_enum; Type: TYPE; Schema: public; Owner: bestkids_user
--

CREATE TYPE public.adaptive_progress_currentlevel_enum AS ENUM (
    '1',
    '2',
    '3',
    '4',
    '5'
);


ALTER TYPE public.adaptive_progress_currentlevel_enum OWNER TO bestkids_user;

--
-- Name: assignments_status_enum; Type: TYPE; Schema: public; Owner: bestkids_user
--

CREATE TYPE public.assignments_status_enum AS ENUM (
    'pending',
    'in_progress',
    'completed',
    'overdue'
);


ALTER TYPE public.assignments_status_enum OWNER TO bestkids_user;

--
-- Name: exercises_type_enum; Type: TYPE; Schema: public; Owner: bestkids_user
--

CREATE TYPE public.exercises_type_enum AS ENUM (
    'SEÑALAR_IMAGEN',
    'OPCION_MULTIPLE',
    'VERDADERO_FALSO',
    'ARRASTRAR_SILABAS',
    'UNIR_LINEAS',
    'CLASIFICAR_GRUPOS',
    'PINTAR',
    'TECLADO_VIRTUAL',
    'AUDIO_SELECCION',
    'COMPLETAR_HUECOS'
);


ALTER TYPE public.exercises_type_enum OWNER TO bestkids_user;

--
-- Name: initial_assessments_difficultylevel_enum; Type: TYPE; Schema: public; Owner: bestkids_user
--

CREATE TYPE public.initial_assessments_difficultylevel_enum AS ENUM (
    '1',
    '2',
    '3',
    '4',
    '5'
);


ALTER TYPE public.initial_assessments_difficultylevel_enum OWNER TO bestkids_user;

--
-- Name: initial_assessments_rtilevel_enum; Type: TYPE; Schema: public; Owner: bestkids_user
--

CREATE TYPE public.initial_assessments_rtilevel_enum AS ENUM (
    'UNIVERSAL',
    'SELECTIVE',
    'INTENSIVE'
);


ALTER TYPE public.initial_assessments_rtilevel_enum OWNER TO bestkids_user;

--
-- Name: moderation_reports_reason_enum; Type: TYPE; Schema: public; Owner: bestkids_user
--

CREATE TYPE public.moderation_reports_reason_enum AS ENUM (
    'offensive_content',
    'harassment',
    'spam',
    'other'
);


ALTER TYPE public.moderation_reports_reason_enum OWNER TO bestkids_user;

--
-- Name: notifications_type_enum; Type: TYPE; Schema: public; Owner: bestkids_user
--

CREATE TYPE public.notifications_type_enum AS ENUM (
    'achievement',
    'assignment',
    'report',
    'alert',
    'message'
);


ALTER TYPE public.notifications_type_enum OWNER TO bestkids_user;

--
-- Name: resources_type_enum; Type: TYPE; Schema: public; Owner: bestkids_user
--

CREATE TYPE public.resources_type_enum AS ENUM (
    'image',
    'video',
    'link',
    'file',
    'documentation'
);


ALTER TYPE public.resources_type_enum OWNER TO bestkids_user;

--
-- Name: store_items_type_enum; Type: TYPE; Schema: public; Owner: bestkids_user
--

CREATE TYPE public.store_items_type_enum AS ENUM (
    'avatar_frame',
    'theme',
    'sticker',
    'powerup'
);


ALTER TYPE public.store_items_type_enum OWNER TO bestkids_user;

--
-- Name: users_academic_level_enum; Type: TYPE; Schema: public; Owner: bestkids_user
--

CREATE TYPE public.users_academic_level_enum AS ENUM (
    'beginner',
    'intermediate',
    'advanced'
);


ALTER TYPE public.users_academic_level_enum OWNER TO bestkids_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: achievements; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.achievements (
    id integer NOT NULL,
    name character varying NOT NULL,
    description text NOT NULL,
    icon character varying NOT NULL,
    type public.achievements_type_enum DEFAULT 'bronze'::public.achievements_type_enum NOT NULL,
    category public.achievements_category_enum DEFAULT 'exercises'::public.achievements_category_enum NOT NULL,
    points_reward integer DEFAULT 50 NOT NULL,
    requirement_value integer DEFAULT 1 NOT NULL,
    requirement_type character varying DEFAULT 'count'::character varying NOT NULL,
    is_secret boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.achievements OWNER TO bestkids_user;

--
-- Name: achievements_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.achievements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.achievements_id_seq OWNER TO bestkids_user;

--
-- Name: achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.achievements_id_seq OWNED BY public.achievements.id;


--
-- Name: adaptive_progress; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.adaptive_progress (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "subjectAreaId" integer NOT NULL,
    "currentLevel" public.adaptive_progress_currentlevel_enum DEFAULT '3'::public.adaptive_progress_currentlevel_enum NOT NULL,
    "consecutiveCorrect" integer DEFAULT 0 NOT NULL,
    "consecutiveIncorrect" integer DEFAULT 0 NOT NULL,
    "totalExercises" integer DEFAULT 0 NOT NULL,
    "correctExercises" integer DEFAULT 0 NOT NULL,
    "accuracyPercentage" numeric(5,2) DEFAULT '0'::numeric NOT NULL,
    "lastUpdated" timestamp without time zone DEFAULT now() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.adaptive_progress OWNER TO bestkids_user;

--
-- Name: adaptive_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.adaptive_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.adaptive_progress_id_seq OWNER TO bestkids_user;

--
-- Name: adaptive_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.adaptive_progress_id_seq OWNED BY public.adaptive_progress.id;


--
-- Name: area_progress; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.area_progress (
    id integer NOT NULL,
    user_id integer NOT NULL,
    subject_area_id integer NOT NULL,
    exercises_attempted integer DEFAULT 0 NOT NULL,
    exercises_correct integer DEFAULT 0 NOT NULL,
    total_points integer DEFAULT 0 NOT NULL,
    current_level integer DEFAULT 1 NOT NULL,
    accuracy_percentage double precision DEFAULT '0'::double precision NOT NULL,
    time_spent_minutes integer DEFAULT 0 NOT NULL,
    last_activity_date date,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.area_progress OWNER TO bestkids_user;

--
-- Name: area_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.area_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.area_progress_id_seq OWNER TO bestkids_user;

--
-- Name: area_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.area_progress_id_seq OWNED BY public.area_progress.id;


--
-- Name: assignments; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.assignments (
    id integer NOT NULL,
    teacher_id integer NOT NULL,
    student_id integer NOT NULL,
    exercise_id integer NOT NULL,
    class_id integer,
    title character varying,
    instructions text,
    status public.assignments_status_enum DEFAULT 'pending'::public.assignments_status_enum NOT NULL,
    due_date timestamp without time zone,
    started_at timestamp without time zone,
    completed_at timestamp without time zone,
    score integer,
    time_spent_seconds integer,
    attempts integer,
    student_answer jsonb,
    feedback text,
    is_graded boolean DEFAULT false NOT NULL,
    points_awarded integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.assignments OWNER TO bestkids_user;

--
-- Name: assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.assignments_id_seq OWNER TO bestkids_user;

--
-- Name: assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.assignments_id_seq OWNED BY public.assignments.id;


--
-- Name: avatars; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.avatars (
    id integer NOT NULL,
    name character varying NOT NULL,
    emoji character varying NOT NULL,
    image_url character varying,
    unlock_points_required integer DEFAULT 0 NOT NULL,
    unlock_level_required integer DEFAULT 1 NOT NULL,
    price integer DEFAULT 0 NOT NULL,
    collection character varying,
    rarity character varying,
    is_default boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.avatars OWNER TO bestkids_user;

--
-- Name: avatars_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.avatars_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.avatars_id_seq OWNER TO bestkids_user;

--
-- Name: avatars_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.avatars_id_seq OWNED BY public.avatars.id;


--
-- Name: centers; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.centers (
    id integer NOT NULL,
    code character varying NOT NULL,
    name character varying NOT NULL,
    address text,
    city character varying,
    postal_code character varying,
    phone character varying,
    email character varying,
    director_name character varying,
    logo_url character varying,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.centers OWNER TO bestkids_user;

--
-- Name: centers_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.centers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.centers_id_seq OWNER TO bestkids_user;

--
-- Name: centers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.centers_id_seq OWNED BY public.centers.id;


--
-- Name: classes; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.classes (
    id integer NOT NULL,
    name character varying NOT NULL,
    teacher_id integer NOT NULL,
    center_id integer,
    academic_year character varying,
    grade character varying,
    section character varying,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.classes OWNER TO bestkids_user;

--
-- Name: classes_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.classes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.classes_id_seq OWNER TO bestkids_user;

--
-- Name: classes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.classes_id_seq OWNED BY public.classes.id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying,
    level character varying NOT NULL,
    subject_area character varying,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.courses OWNER TO bestkids_user;

--
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.courses_id_seq OWNER TO bestkids_user;

--
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- Name: exercise_attempts; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.exercise_attempts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    exercise_id integer NOT NULL,
    user_answer jsonb,
    is_correct boolean NOT NULL,
    points_earned integer DEFAULT 0 NOT NULL,
    attempt_number integer DEFAULT 1 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    time_taken_seconds integer,
    time_spent_seconds integer,
    difficulty_level character varying(20) DEFAULT 'easy'::character varying NOT NULL
);


ALTER TABLE public.exercise_attempts OWNER TO bestkids_user;

--
-- Name: exercise_attempts_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.exercise_attempts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.exercise_attempts_id_seq OWNER TO bestkids_user;

--
-- Name: exercise_attempts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.exercise_attempts_id_seq OWNED BY public.exercise_attempts.id;


--
-- Name: exercise_options; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.exercise_options (
    id integer NOT NULL,
    exercise_id integer NOT NULL,
    content text NOT NULL,
    is_image boolean DEFAULT false NOT NULL,
    is_correct boolean DEFAULT false NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.exercise_options OWNER TO bestkids_user;

--
-- Name: exercise_options_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.exercise_options_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.exercise_options_id_seq OWNER TO bestkids_user;

--
-- Name: exercise_options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.exercise_options_id_seq OWNED BY public.exercise_options.id;


--
-- Name: exercises; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.exercises (
    id integer NOT NULL,
    subject_area_id integer,
    unit_id integer,
    type public.exercises_type_enum NOT NULL,
    instruction text NOT NULL,
    instruction_audio_url character varying,
    background_image_url character varying,
    background_color character varying,
    difficulty integer DEFAULT 1 NOT NULL,
    points integer DEFAULT 10 NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    content jsonb NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.exercises OWNER TO bestkids_user;

--
-- Name: exercises_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.exercises_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.exercises_id_seq OWNER TO bestkids_user;

--
-- Name: exercises_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.exercises_id_seq OWNED BY public.exercises.id;


--
-- Name: feedback; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.feedback (
    id integer NOT NULL,
    message text NOT NULL,
    category character varying(50) DEFAULT 'sugerencia'::character varying NOT NULL,
    page character varying(255),
    user_agent text,
    user_id integer,
    screenshot text,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.feedback OWNER TO bestkids_user;

--
-- Name: feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.feedback_id_seq OWNER TO bestkids_user;

--
-- Name: feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.feedback_id_seq OWNED BY public.feedback.id;


--
-- Name: gamification_profiles; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.gamification_profiles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    total_points integer DEFAULT 0 NOT NULL,
    current_level integer DEFAULT 1 NOT NULL,
    experience_points integer DEFAULT 0 NOT NULL,
    daily_points integer DEFAULT 0 NOT NULL,
    weekly_points integer DEFAULT 0 NOT NULL,
    monthly_points integer DEFAULT 0 NOT NULL,
    current_streak_days integer DEFAULT 0 NOT NULL,
    longest_streak_days integer DEFAULT 0 NOT NULL,
    exercises_completed integer DEFAULT 0 NOT NULL,
    exercises_correct integer DEFAULT 0 NOT NULL,
    perfect_scores integer DEFAULT 0 NOT NULL,
    coins integer DEFAULT 0 NOT NULL,
    selected_avatar_id integer,
    last_activity_date date,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.gamification_profiles OWNER TO bestkids_user;

--
-- Name: gamification_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.gamification_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.gamification_profiles_id_seq OWNER TO bestkids_user;

--
-- Name: gamification_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.gamification_profiles_id_seq OWNED BY public.gamification_profiles.id;


--
-- Name: initial_assessments; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.initial_assessments (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "subjectAreaId" integer NOT NULL,
    score numeric(5,2) DEFAULT '0'::numeric NOT NULL,
    "totalQuestions" integer DEFAULT 0 NOT NULL,
    "correctAnswers" integer DEFAULT 0 NOT NULL,
    "difficultyLevel" public.initial_assessments_difficultylevel_enum DEFAULT '3'::public.initial_assessments_difficultylevel_enum NOT NULL,
    "rtiLevel" public.initial_assessments_rtilevel_enum DEFAULT 'SELECTIVE'::public.initial_assessments_rtilevel_enum NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    "completedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.initial_assessments OWNER TO bestkids_user;

--
-- Name: initial_assessments_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.initial_assessments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.initial_assessments_id_seq OWNER TO bestkids_user;

--
-- Name: initial_assessments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.initial_assessments_id_seq OWNED BY public.initial_assessments.id;


--
-- Name: level_exercises; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.level_exercises (
    id integer NOT NULL,
    level_id integer NOT NULL,
    exercise_id integer NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    is_required boolean DEFAULT true NOT NULL
);


ALTER TABLE public.level_exercises OWNER TO bestkids_user;

--
-- Name: level_exercises_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.level_exercises_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.level_exercises_id_seq OWNER TO bestkids_user;

--
-- Name: level_exercises_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.level_exercises_id_seq OWNED BY public.level_exercises.id;


--
-- Name: mentoring_sessions; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.mentoring_sessions (
    id integer NOT NULL,
    tutor_id integer NOT NULL,
    student_id integer NOT NULL,
    "scheduledAt" timestamp without time zone NOT NULL,
    status character varying DEFAULT 'scheduled'::character varying NOT NULL,
    notes text,
    "meetingLink" character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.mentoring_sessions OWNER TO bestkids_user;

--
-- Name: mentoring_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.mentoring_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mentoring_sessions_id_seq OWNER TO bestkids_user;

--
-- Name: mentoring_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.mentoring_sessions_id_seq OWNED BY public.mentoring_sessions.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    sender_id integer NOT NULL,
    recipient_id integer NOT NULL,
    subject character varying NOT NULL,
    content text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    read_at timestamp without time zone,
    parent_message_id integer,
    is_deleted_by_sender boolean DEFAULT false NOT NULL,
    is_deleted_by_recipient boolean DEFAULT false NOT NULL,
    is_announcement boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.messages OWNER TO bestkids_user;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.messages_id_seq OWNER TO bestkids_user;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: moderation_reports; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.moderation_reports (
    id integer NOT NULL,
    reporter_id integer NOT NULL,
    reported_user_id integer,
    reason public.moderation_reports_reason_enum NOT NULL,
    description text,
    content_ref character varying,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.moderation_reports OWNER TO bestkids_user;

--
-- Name: moderation_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.moderation_reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.moderation_reports_id_seq OWNER TO bestkids_user;

--
-- Name: moderation_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.moderation_reports_id_seq OWNED BY public.moderation_reports.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    type public.notifications_type_enum NOT NULL,
    title character varying NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notifications OWNER TO bestkids_user;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notifications_id_seq OWNER TO bestkids_user;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: resources; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.resources (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text,
    type public.resources_type_enum DEFAULT 'image'::public.resources_type_enum NOT NULL,
    url character varying NOT NULL,
    category character varying,
    metadata jsonb,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.resources OWNER TO bestkids_user;

--
-- Name: resources_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.resources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.resources_id_seq OWNER TO bestkids_user;

--
-- Name: resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.resources_id_seq OWNED BY public.resources.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying NOT NULL,
    display_name character varying NOT NULL,
    description text,
    level integer NOT NULL,
    permissions jsonb,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.roles OWNER TO bestkids_user;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO bestkids_user;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: store_items; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.store_items (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying,
    type public.store_items_type_enum DEFAULT 'sticker'::public.store_items_type_enum NOT NULL,
    cost integer NOT NULL,
    "imageUrl" character varying,
    unlock_level integer DEFAULT 1 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.store_items OWNER TO bestkids_user;

--
-- Name: store_items_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.store_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.store_items_id_seq OWNER TO bestkids_user;

--
-- Name: store_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.store_items_id_seq OWNED BY public.store_items.id;


--
-- Name: student_tutors; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.student_tutors (
    id integer NOT NULL,
    student_id integer NOT NULL,
    tutor_id integer NOT NULL,
    assigned_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.student_tutors OWNER TO bestkids_user;

--
-- Name: student_tutors_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.student_tutors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.student_tutors_id_seq OWNER TO bestkids_user;

--
-- Name: student_tutors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.student_tutors_id_seq OWNED BY public.student_tutors.id;


--
-- Name: subject_areas; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.subject_areas (
    id integer NOT NULL,
    name character varying NOT NULL,
    description text,
    icon character varying NOT NULL,
    color_hex character varying NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.subject_areas OWNER TO bestkids_user;

--
-- Name: subject_areas_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.subject_areas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.subject_areas_id_seq OWNER TO bestkids_user;

--
-- Name: subject_areas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.subject_areas_id_seq OWNED BY public.subject_areas.id;


--
-- Name: units; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.units (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text,
    world_id integer,
    course_id integer,
    order_index integer DEFAULT 0 NOT NULL,
    difficulty integer DEFAULT 1 NOT NULL,
    cover_image_url character varying,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.units OWNER TO bestkids_user;

--
-- Name: units_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.units_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.units_id_seq OWNER TO bestkids_user;

--
-- Name: units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.units_id_seq OWNED BY public.units.id;


--
-- Name: user_achievements; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.user_achievements (
    id integer NOT NULL,
    user_id integer NOT NULL,
    achievement_id integer NOT NULL,
    unlocked_at timestamp without time zone NOT NULL,
    progress_current integer DEFAULT 0 NOT NULL,
    progress_target integer DEFAULT 1 NOT NULL,
    is_claimed boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_achievements OWNER TO bestkids_user;

--
-- Name: user_achievements_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.user_achievements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_achievements_id_seq OWNER TO bestkids_user;

--
-- Name: user_achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.user_achievements_id_seq OWNED BY public.user_achievements.id;


--
-- Name: user_exercise_results; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.user_exercise_results (
    id integer NOT NULL,
    user_id integer NOT NULL,
    exercise_id integer NOT NULL,
    unit_id integer,
    is_correct boolean NOT NULL,
    response_time_ms integer NOT NULL,
    attempt_number integer DEFAULT 1 NOT NULL,
    user_answer jsonb,
    xp_earned integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_exercise_results OWNER TO bestkids_user;

--
-- Name: user_exercise_results_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.user_exercise_results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_exercise_results_id_seq OWNER TO bestkids_user;

--
-- Name: user_exercise_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.user_exercise_results_id_seq OWNED BY public.user_exercise_results.id;


--
-- Name: user_inventory; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.user_inventory (
    id integer NOT NULL,
    user_id integer NOT NULL,
    item_id integer NOT NULL,
    is_equipped boolean DEFAULT false NOT NULL,
    acquired_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_inventory OWNER TO bestkids_user;

--
-- Name: user_inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.user_inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_inventory_id_seq OWNER TO bestkids_user;

--
-- Name: user_inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.user_inventory_id_seq OWNED BY public.user_inventory.id;


--
-- Name: user_level_progress; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.user_level_progress (
    id integer NOT NULL,
    user_id integer NOT NULL,
    level_id integer NOT NULL,
    is_completed boolean DEFAULT false NOT NULL,
    stars_earned integer DEFAULT 0 NOT NULL,
    exercises_completed integer DEFAULT 0 NOT NULL,
    total_exercises integer DEFAULT 0 NOT NULL,
    is_unlocked boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_level_progress OWNER TO bestkids_user;

--
-- Name: user_level_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.user_level_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_level_progress_id_seq OWNER TO bestkids_user;

--
-- Name: user_level_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.user_level_progress_id_seq OWNED BY public.user_level_progress.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    academic_level public.users_academic_level_enum DEFAULT 'beginner'::public.users_academic_level_enum NOT NULL,
    placement_test_taken boolean DEFAULT false NOT NULL,
    role_id integer NOT NULL,
    center_id integer,
    parent_id integer,
    class_id integer,
    username character varying NOT NULL,
    student_code character varying,
    password_hash character varying NOT NULL,
    email character varying NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    phone character varying,
    birth_date date,
    avatar_id integer,
    equipped_frame_id integer,
    equipped_theme_id integer,
    language_code character varying(5) DEFAULT 'es'::character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    last_login_at timestamp without time zone,
    last_login_ip character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.users OWNER TO bestkids_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO bestkids_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: world_levels; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.world_levels (
    id integer NOT NULL,
    world_id integer NOT NULL,
    name character varying NOT NULL,
    description text,
    level_number integer NOT NULL,
    points_to_unlock integer DEFAULT 0 NOT NULL,
    stars_required integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.world_levels OWNER TO bestkids_user;

--
-- Name: world_levels_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.world_levels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.world_levels_id_seq OWNER TO bestkids_user;

--
-- Name: world_levels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.world_levels_id_seq OWNED BY public.world_levels.id;


--
-- Name: worlds; Type: TABLE; Schema: public; Owner: bestkids_user
--

CREATE TABLE public.worlds (
    id integer NOT NULL,
    name character varying NOT NULL,
    description text,
    icon character varying,
    background_image character varying,
    color_theme character varying DEFAULT '#4A90E2'::character varying NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    points_to_unlock integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    subject_area_id integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.worlds OWNER TO bestkids_user;

--
-- Name: worlds_id_seq; Type: SEQUENCE; Schema: public; Owner: bestkids_user
--

CREATE SEQUENCE public.worlds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.worlds_id_seq OWNER TO bestkids_user;

--
-- Name: worlds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bestkids_user
--

ALTER SEQUENCE public.worlds_id_seq OWNED BY public.worlds.id;


--
-- Name: achievements id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.achievements ALTER COLUMN id SET DEFAULT nextval('public.achievements_id_seq'::regclass);


--
-- Name: adaptive_progress id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.adaptive_progress ALTER COLUMN id SET DEFAULT nextval('public.adaptive_progress_id_seq'::regclass);


--
-- Name: area_progress id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.area_progress ALTER COLUMN id SET DEFAULT nextval('public.area_progress_id_seq'::regclass);


--
-- Name: assignments id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.assignments ALTER COLUMN id SET DEFAULT nextval('public.assignments_id_seq'::regclass);


--
-- Name: avatars id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.avatars ALTER COLUMN id SET DEFAULT nextval('public.avatars_id_seq'::regclass);


--
-- Name: centers id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.centers ALTER COLUMN id SET DEFAULT nextval('public.centers_id_seq'::regclass);


--
-- Name: classes id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.classes ALTER COLUMN id SET DEFAULT nextval('public.classes_id_seq'::regclass);


--
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- Name: exercise_attempts id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.exercise_attempts ALTER COLUMN id SET DEFAULT nextval('public.exercise_attempts_id_seq'::regclass);


--
-- Name: exercise_options id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.exercise_options ALTER COLUMN id SET DEFAULT nextval('public.exercise_options_id_seq'::regclass);


--
-- Name: exercises id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.exercises ALTER COLUMN id SET DEFAULT nextval('public.exercises_id_seq'::regclass);


--
-- Name: feedback id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.feedback ALTER COLUMN id SET DEFAULT nextval('public.feedback_id_seq'::regclass);


--
-- Name: gamification_profiles id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.gamification_profiles ALTER COLUMN id SET DEFAULT nextval('public.gamification_profiles_id_seq'::regclass);


--
-- Name: initial_assessments id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.initial_assessments ALTER COLUMN id SET DEFAULT nextval('public.initial_assessments_id_seq'::regclass);


--
-- Name: level_exercises id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.level_exercises ALTER COLUMN id SET DEFAULT nextval('public.level_exercises_id_seq'::regclass);


--
-- Name: mentoring_sessions id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.mentoring_sessions ALTER COLUMN id SET DEFAULT nextval('public.mentoring_sessions_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: moderation_reports id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.moderation_reports ALTER COLUMN id SET DEFAULT nextval('public.moderation_reports_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: resources id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.resources ALTER COLUMN id SET DEFAULT nextval('public.resources_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: store_items id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.store_items ALTER COLUMN id SET DEFAULT nextval('public.store_items_id_seq'::regclass);


--
-- Name: student_tutors id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.student_tutors ALTER COLUMN id SET DEFAULT nextval('public.student_tutors_id_seq'::regclass);


--
-- Name: subject_areas id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.subject_areas ALTER COLUMN id SET DEFAULT nextval('public.subject_areas_id_seq'::regclass);


--
-- Name: units id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.units ALTER COLUMN id SET DEFAULT nextval('public.units_id_seq'::regclass);


--
-- Name: user_achievements id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.user_achievements ALTER COLUMN id SET DEFAULT nextval('public.user_achievements_id_seq'::regclass);


--
-- Name: user_exercise_results id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.user_exercise_results ALTER COLUMN id SET DEFAULT nextval('public.user_exercise_results_id_seq'::regclass);


--
-- Name: user_inventory id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.user_inventory ALTER COLUMN id SET DEFAULT nextval('public.user_inventory_id_seq'::regclass);


--
-- Name: user_level_progress id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.user_level_progress ALTER COLUMN id SET DEFAULT nextval('public.user_level_progress_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: world_levels id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.world_levels ALTER COLUMN id SET DEFAULT nextval('public.world_levels_id_seq'::regclass);


--
-- Name: worlds id; Type: DEFAULT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.worlds ALTER COLUMN id SET DEFAULT nextval('public.worlds_id_seq'::regclass);


--
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.achievements (id, name, description, icon, type, category, points_reward, requirement_value, requirement_type, is_secret, is_active, sort_order, created_at) FROM stdin;
\.


--
-- Data for Name: adaptive_progress; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.adaptive_progress (id, "userId", "subjectAreaId", "currentLevel", "consecutiveCorrect", "consecutiveIncorrect", "totalExercises", "correctExercises", "accuracyPercentage", "lastUpdated", "createdAt") FROM stdin;
\.


--
-- Data for Name: area_progress; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.area_progress (id, user_id, subject_area_id, exercises_attempted, exercises_correct, total_points, current_level, accuracy_percentage, time_spent_minutes, last_activity_date, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: assignments; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.assignments (id, teacher_id, student_id, exercise_id, class_id, title, instructions, status, due_date, started_at, completed_at, score, time_spent_seconds, attempts, student_answer, feedback, is_graded, points_awarded, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: avatars; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.avatars (id, name, emoji, image_url, unlock_points_required, unlock_level_required, price, collection, rarity, is_default, created_at) FROM stdin;
1	Robot B0T	🤖	\N	2500	5	0	\N	\N	f	2026-03-08 10:38:18.264404
2	Astronauta Estelar	👨‍🚀	\N	5000	10	0	\N	\N	f	2026-03-08 10:38:18.266535
3	Mago Cósmico	🧙	\N	10000	15	0	\N	\N	f	2026-03-08 10:38:18.269467
4	Super Niñ@	🦸	\N	15000	20	0	\N	\N	f	2026-03-08 10:38:18.270904
\.


--
-- Data for Name: centers; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.centers (id, code, name, address, city, postal_code, phone, email, director_name, logo_url, is_active, created_at, updated_at) FROM stdin;
1	CEIP-SM-001	CEIP San Miguel	Calle Principal 1, Madrid	\N	\N	912345678	\N	\N	\N	t	2026-03-08 10:38:18.054396	2026-03-08 10:38:18.054396
2	CEIP-SA-002	CEIP Santa Ana	Avenida Central 45, Barcelona	\N	\N	934567890	\N	\N	\N	t	2026-03-08 10:38:18.054396	2026-03-08 10:38:18.054396
3	CEIP-EP-003	CEIP El Prado	Plaza Mayor 12, Valencia	\N	\N	963456789	\N	\N	\N	t	2026-03-08 10:38:18.054396	2026-03-08 10:38:18.054396
4	CEIP-LO-004	CEIP Los Olivos	Calle Verde 23, Sevilla	\N	\N	954321098	\N	\N	\N	t	2026-03-08 10:38:18.054396	2026-03-08 10:38:18.054396
5	CEIP-LE-005	CEIP La Esperanza	Paseo del Sol 8, Málaga	\N	\N	952123456	\N	\N	\N	t	2026-03-08 10:38:18.054396	2026-03-08 10:38:18.054396
\.


--
-- Data for Name: classes; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.classes (id, name, teacher_id, center_id, academic_year, grade, section, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.courses (id, name, description, level, subject_area, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: exercise_attempts; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.exercise_attempts (id, user_id, exercise_id, user_answer, is_correct, points_earned, attempt_number, created_at, time_taken_seconds, time_spent_seconds, difficulty_level) FROM stdin;
\.


--
-- Data for Name: exercise_options; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.exercise_options (id, exercise_id, content, is_image, is_correct, order_index, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: exercises; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.exercises (id, subject_area_id, unit_id, type, instruction, instruction_audio_url, background_image_url, background_color, difficulty, points, "order", content, is_active, created_at, updated_at) FROM stdin;
1	\N	1	OPCION_MULTIPLE	¿Cuántas manzanas hay?	\N	\N	\N	1	10	0	{"options": [{"id": "1", "text": "1", "isCorrect": false}, {"id": "2", "text": "3", "isCorrect": true}, {"id": "3", "text": "5", "isCorrect": false}]}	t	2026-03-08 10:38:17.855913	2026-03-08 10:38:17.855913
2	\N	1	SEÑALAR_IMAGEN	Selecciona el grupo con 2 elementos	\N	\N	\N	1	10	0	{"options": [{"id": "1", "imageUrl": "/placeholders/group1.png", "isCorrect": false}, {"id": "2", "imageUrl": "/placeholders/group2.png", "isCorrect": true}, {"id": "3", "imageUrl": "/placeholders/group3.png", "isCorrect": false}], "multipleCorrect": false}	t	2026-03-08 10:38:17.861169	2026-03-08 10:38:17.861169
3	\N	2	COMPLETAR_HUECOS	¿Con qué letra empieza la palabra "Oso"?	\N	\N	\N	1	10	0	{"gaps": [{"id": "gap1", "correctAnswer": "O"}], "text": "[gap1]so"}	t	2026-03-08 10:38:17.866255	2026-03-08 10:38:17.866255
4	\N	3	SEÑALAR_IMAGEN	¿Cuál de estos es un perro?	\N	\N	\N	1	10	0	{"options": [{"id": "1", "text": "Perro", "imageUrl": "https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg", "isCorrect": true}, {"id": "2", "text": "Gato", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg", "isCorrect": false}, {"id": "3", "text": "Vaca", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Cow_female_black_white.jpg/1200px-Cow_female_black_white.jpg", "isCorrect": false}], "multipleCorrect": false}	t	2026-03-08 10:38:18.274334	2026-03-08 10:38:18.274334
5	\N	3	OPCION_MULTIPLE	Selecciona el número dos	\N	\N	\N	1	10	1	{"options": [{"id": "1", "text": "1", "isCorrect": false}, {"id": "2", "text": "2", "isCorrect": true}, {"id": "3", "text": "3", "isCorrect": false}]}	t	2026-03-08 10:38:18.276996	2026-03-08 10:38:18.276996
6	\N	3	VERDADERO_FALSO	¿Son el mismo animal?	\N	\N	\N	1	10	2	{"stimulusA": {"type": "text", "value": "🦁"}, "stimulusB": {"type": "text", "value": "🦁"}, "correctAnswer": true}	t	2026-03-08 10:38:18.277911	2026-03-08 10:38:18.277911
7	\N	3	ARRASTRAR_SILABAS	Forma la palabra GATO	\N	\N	\N	1	10	3	{"items": [{"id": "i1", "word": "GATO", "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg", "syllables": ["GA", "TO"], "givenSyllables": ["GA", null]}], "availableSyllables": ["TO", "MA", "LO"]}	t	2026-03-08 10:38:18.280561	2026-03-08 10:38:18.280561
8	\N	3	UNIR_LINEAS	Une cada fruta con su color	\N	\N	\N	1	10	4	{"leftItems": [{"id": "l1", "text": "🍎 (Manzana)"}, {"id": "l2", "text": "🍌 (Plátano)"}], "rightItems": [{"id": "r1", "text": "ROJO"}, {"id": "r2", "text": "AMARILLO"}], "correctPairs": [["l1", "r1"], ["l2", "r2"]]}	t	2026-03-08 10:38:18.284336	2026-03-08 10:38:18.284336
9	\N	3	CLASIFICAR_GRUPOS	Pon cada fruta en su canasta	\N	\N	\N	1	10	5	{"items": [{"id": "it1", "text": "🍎", "correctGroupId": "g1"}, {"id": "it2", "text": "🍓", "correctGroupId": "g1"}, {"id": "it3", "text": "🍌", "correctGroupId": "g2"}], "groups": [{"id": "g1", "label": "ROJAS"}, {"id": "g2", "label": "AMARILLAS"}]}	t	2026-03-08 10:38:18.287896	2026-03-08 10:38:18.287896
10	\N	3	PINTAR	Pinta el sol de amarillo	\N	\N	\N	1	10	6	{"items": [{"id": "sun", "label": "Sol", "imageUrl": "https://www.freeiconspng.com/uploads/sun-icon-2.png"}], "colors": ["#FF0000", "#FFFF00", "#0000FF"], "correctPairs": [{"color": "#FFFF00", "itemId": "sun"}]}	t	2026-03-08 10:38:18.289354	2026-03-08 10:38:18.289354
11	\N	3	TECLADO_VIRTUAL	Escribe la sílaba que falta: PE-___	\N	\N	\N	1	10	7	{"imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Pera_01.jpg/1200px-Pera_01.jpg", "targetPosition": 1, "totalSyllables": 2, "correctSyllable": "RA"}	t	2026-03-08 10:38:18.290757	2026-03-08 10:38:18.290757
13	\N	3	COMPLETAR_HUECOS	Completa la frase	\N	\N	\N	1	10	9	{"gaps": [{"id": "gap1", "correctAnswer": "amarillo"}], "text": "El sol es de color [gap1] y brilla mucho", "imageUrl": "https://www.freeiconspng.com/uploads/sun-icon-2.png"}	t	2026-03-08 10:38:18.297093	2026-03-08 10:38:18.297093
14	\N	1	OPCION_MULTIPLE	selecciona los muebles del salon	\N	\N	\N	1	10	0	{"options": [{"id": "opt_1772966483832", "text": "mueble 1", "imageUrl": "/api/media/file/images/98ed561a-dbaf-43e2-91cf-e0e99385c0f6.jpg", "isCorrect": true}, {"id": "opt_1772966500087", "text": "mueble 2", "imageUrl": "/api/media/file/images/5d2b1a77-5132-4a7d-8dcb-0e42c2aaeea6.jpeg", "isCorrect": false}], "stimulus": null}	t	2026-03-08 10:44:36.581456	2026-03-08 10:44:36.581456
15	\N	1	UNIR_LINEAS	completa	\N	\N	\N	1	10	0	{"leftItems": ["coche", "casa", "cuerpo"], "rightItems": ["motor", "mano", "tejado"], "correctPairs": []}	t	2026-03-08 10:46:16.099905	2026-03-08 10:46:16.099905
16	\N	1	AUDIO_SELECCION	dddddd	\N	\N	\N	1	10	0	{"options": [{"id": "opt_1772966827401", "text": "hola mundoffff", "audioUrl": "/api/media/file/audio/35da9d4f-9116-4867-b3fe-2ee78982ea07.mp3", "imageUrl": "", "isCorrect": true}, {"id": "opt_1772966848878", "text": "chao pescao", "audioUrl": "/api/media/file/audio/eebbb78b-c41a-438f-986a-4c67e2c3c02d.mp3", "imageUrl": "", "isCorrect": false}], "multipleCorrect": false}	t	2026-03-08 10:48:29.802949	2026-03-08 10:48:29.802949
17	\N	1	PINTAR	ddddd	\N	\N	\N	1	10	0	{"items": [], "colors": ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"], "imageUrl": "/api/media/file/images/5d2b1a77-5132-4a7d-8dcb-0e42c2aaeea6.jpeg", "correctPairs": []}	t	2026-03-08 10:49:14.166197	2026-03-08 10:49:14.166197
18	\N	1	VERDADERO_FALSO	hola	\N	\N	\N	1	10	0	{"stimulusA": {"type": "text", "value": "gato "}, "stimulusB": {"type": "text", "value": "5 patas"}, "correctAnswer": false}	t	2026-03-08 10:51:31.442058	2026-03-08 10:51:31.442058
19	\N	1	ARRASTRAR_SILABAS	sfsdfsf	\N	\N	\N	1	10	0	{"items": [{"id": "i1", "word": "HOLA", "imageUrl": "/api/media/file/images/98ed561a-dbaf-43e2-91cf-e0e99385c0f6.jpg", "syllables": ["JE", "JO"], "givenSyllables": []}], "availableSyllables": ["LA", "LO"]}	t	2026-03-08 10:52:38.492365	2026-03-08 10:52:38.492365
20	1	4	ARRASTRAR_SILABAS	Une las piezas para formar la palabra MATE.	\N	\N	\N	1	10	1	{"words": [{"id": "w1", "parts": ["MA", "TE"], "targetWord": "MATE", "missingIndices": [0, 1]}], "syllablePool": ["MA", "TE", "SO", "LA"], "caseSensitive": false}	t	2026-03-09 17:57:18.624945	2026-03-09 17:57:18.624945
21	1	4	COMPLETAR_HUECOS	Completa la secuencia numérica.	\N	\N	\N	1	10	2	{"gaps": [{"id": "g1", "options": ["2", "3", "5"], "correctAnswer": "3"}, {"id": "g2", "options": ["6", "7", "8"], "correctAnswer": "6"}], "textWithGaps": "1, 2, ___, 4, 5, ___"}	t	2026-03-09 17:57:18.624945	2026-03-09 17:57:18.624945
22	1	4	AUDIO_SELECCION	Escucha el número y selecciona la imagen correcta.	\N	\N	\N	1	10	3	{"options": [{"id": "o1", "text": "Número 5", "imageUrl": "https://cdn-icons-png.flaticon.com/512/3655/3655531.png", "isCorrect": true}, {"id": "o2", "text": "Número 8", "imageUrl": "https://cdn-icons-png.flaticon.com/512/3655/3655544.png", "isCorrect": false}], "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"}	t	2026-03-09 17:57:18.624945	2026-03-09 17:57:18.624945
23	1	4	PINTAR	Pinta la imagen guiándote de la muestra.	\N	\N	\N	1	10	4	{"baseImage": "https://i.pinimg.com/originals/db/f8/bf/dbf8bf448555e37843dd256afeb6e6d1.jpg", "expectedColors": [{"color": "#FF0000", "itemId": "body"}], "availableColors": ["#FF0000", "#00FF00", "#0000FF"]}	t	2026-03-09 17:57:18.624945	2026-03-09 17:57:18.624945
24	1	4	OPCION_MULTIPLE	Mira el video de sumas y responde.	\N	\N	\N	1	15	5	{"options": [{"id": "opt1", "text": "10", "isCorrect": true}, {"id": "opt2", "text": "5", "isCorrect": false}], "imageUrl": "https://media.gcflearnfree.org/content/5b47a9ef318625076cf47e8f_07_12_2018/1.1__count__dots_es.png", "question": "¿Cuál es el resultado de 5+5?", "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"}	t	2026-03-09 17:57:18.624945	2026-03-09 17:57:18.624945
12	\N	3	AUDIO_SELECCION	¿Qué sonido hace la vaca?	\N	\N	\N	1	10	8	{"options": [{"id": "a1", "label": "Sonido 1", "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"}, {"id": "a2", "label": "Sonido 2", "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"}], "stimulusText": "🐮", "multipleCorrect": false}	t	2026-03-08 10:38:18.295125	2026-03-08 10:38:18.295125
\.


--
-- Data for Name: feedback; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.feedback (id, message, category, page, user_agent, user_id, screenshot, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: gamification_profiles; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.gamification_profiles (id, user_id, total_points, current_level, experience_points, daily_points, weekly_points, monthly_points, current_streak_days, longest_streak_days, exercises_completed, exercises_correct, perfect_scores, coins, selected_avatar_id, last_activity_date, created_at, updated_at) FROM stdin;
1	105	5000	1	0	0	5000	0	0	0	0	0	0	0	\N	\N	2026-03-08 10:38:18.236592	2026-03-08 10:38:18.236592
\.


--
-- Data for Name: initial_assessments; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.initial_assessments (id, "userId", "subjectAreaId", score, "totalQuestions", "correctAnswers", "difficultyLevel", "rtiLevel", completed, "completedAt") FROM stdin;
\.


--
-- Data for Name: level_exercises; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.level_exercises (id, level_id, exercise_id, order_index, is_required) FROM stdin;
\.


--
-- Data for Name: mentoring_sessions; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.mentoring_sessions (id, tutor_id, student_id, "scheduledAt", status, notes, "meetingLink", created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.messages (id, sender_id, recipient_id, subject, content, is_read, read_at, parent_message_id, is_deleted_by_sender, is_deleted_by_recipient, is_announcement, created_at) FROM stdin;
\.


--
-- Data for Name: moderation_reports; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.moderation_reports (id, reporter_id, reported_user_id, reason, description, content_ref, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.notifications (id, user_id, type, title, message, is_read, metadata, created_at) FROM stdin;
\.


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.resources (id, title, description, type, url, category, metadata, created_by, created_at, updated_at) FROM stdin;
1	ddd		image	/api/media/file/images/98ed561a-dbaf-43e2-91cf-e0e99385c0f6.jpg	General	\N	101	2026-03-08 10:40:12.282152	2026-03-08 10:40:12.282152
2	Recurso 8/3/2026	\N	image	/api/media/file/images/5d2b1a77-5132-4a7d-8dcb-0e42c2aaeea6.jpeg	Ejercicios	\N	101	2026-03-08 10:41:54.228807	2026-03-08 10:41:54.228807
3	rsgsdf		image	/api/media/file/images/3b689ffd-5424-4321-a0af-aa26e02bdfcb.jpeg	Ejercicios	\N	101	2026-03-09 20:15:20.295854	2026-03-09 20:15:20.295854
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.roles (id, name, display_name, description, level, permissions, created_at, updated_at) FROM stdin;
1	master	Master	Super Administrador del Sistema	100	\N	2026-03-08 10:38:17.780073	2026-03-08 10:38:17.780073
2	admin	Administrador	Administrador de Centro	80	\N	2026-03-08 10:38:17.789678	2026-03-08 10:38:17.789678
3	teacher	Profesor	Rol para docentes	60	\N	2026-03-08 10:38:17.793897	2026-03-08 10:38:17.793897
4	parent	Padre	Rol para padres y tutores	40	\N	2026-03-08 10:38:17.797685	2026-03-08 10:38:17.797685
5	student	Estudiante	Rol para alumnos	20	\N	2026-03-08 10:38:17.8002	2026-03-08 10:38:17.8002
\.


--
-- Data for Name: store_items; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.store_items (id, name, description, type, cost, "imageUrl", unlock_level, is_active, created_at, updated_at) FROM stdin;
1	Gafas de Sol Cool	¡Añade estilo a tu avatar con estas gafas geniales!	sticker	50	https://cdn-icons-png.flaticon.com/512/4140/4140047.png	1	t	2026-03-08 10:38:18.21102	2026-03-08 10:38:18.21102
2	Sombrero de Fiesta	¡Listo para celebrar cada logro!	sticker	100	https://cdn-icons-png.flaticon.com/512/2418/2418147.png	1	t	2026-03-08 10:38:18.213485	2026-03-08 10:38:18.213485
3	Corona de Campeón	Para los reyes y reinas del aprendizaje.	sticker	200	https://cdn-icons-png.flaticon.com/512/2923/2923223.png	1	t	2026-03-08 10:38:18.219219	2026-03-08 10:38:18.219219
4	Capa de Superhéroe	¡Vuela hacia el conocimiento!	sticker	300	https://cdn-icons-png.flaticon.com/512/5632/5632381.png	1	t	2026-03-08 10:38:18.221336	2026-03-08 10:38:18.221336
5	Marco Dorado	Un marco brillante para campeones.	avatar_frame	500	https://cdn-icons-png.flaticon.com/512/2550/2550254.png	1	t	2026-03-08 10:38:18.222358	2026-03-08 10:38:18.222358
6	Marco Neón	¡Brilla con luz propia!	avatar_frame	750	https://cdn-icons-png.flaticon.com/512/3504/3504066.png	1	t	2026-03-08 10:38:18.223597	2026-03-08 10:38:18.223597
7	Marco Arcoíris	Todos los colores del éxito.	avatar_frame	600	https://cdn-icons-png.flaticon.com/512/616/616554.png	1	t	2026-03-08 10:38:18.226539	2026-03-08 10:38:18.226539
8	Tema Espacial	Lleva tu dashboard a las estrellas.	theme	2000	https://cdn-icons-png.flaticon.com/512/1545/1545532.png	1	t	2026-03-08 10:38:18.228308	2026-03-08 10:38:18.228308
9	Tema Selva	¡Salvaje y verde como la naturaleza!	theme	1500	https://cdn-icons-png.flaticon.com/512/484/484167.png	1	t	2026-03-08 10:38:18.229628	2026-03-08 10:38:18.229628
10	Tema Oceánico	Sumérgete en el aprendizaje marino.	theme	1800	https://cdn-icons-png.flaticon.com/512/2942/2942079.png	1	t	2026-03-08 10:38:18.230793	2026-03-08 10:38:18.230793
\.


--
-- Data for Name: student_tutors; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.student_tutors (id, student_id, tutor_id, assigned_at) FROM stdin;
\.


--
-- Data for Name: subject_areas; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.subject_areas (id, name, description, icon, color_hex, order_index, is_active, created_at, updated_at) FROM stdin;
1	Matemáticas	Números, operaciones, geometría y problemas matemáticos	🔢	#667eea	1	t	2026-03-08 10:38:17.806478	2026-03-08 10:38:17.806478
2	Lengua y Literatura	Lectura, escritura, gramática y comprensión lectora	📚	#F8E71C	2	t	2026-03-08 10:38:17.806478	2026-03-08 10:38:17.806478
3	Ciencias Naturales	Biología, física, química y el mundo natural	🔬	#7ED321	3	t	2026-03-08 10:38:17.806478	2026-03-08 10:38:17.806478
4	Ciencias Sociales	Historia, geografía y sociedad	🌍	#F5A623	4	t	2026-03-08 10:38:17.806478	2026-03-08 10:38:17.806478
5	Inglés	Vocabulario, gramática y conversación en inglés	🇬🇧	#BD10E0	5	t	2026-03-08 10:38:17.806478	2026-03-08 10:38:17.806478
6	Arte y Creatividad	Dibujo, música, manualidades y expresión artística	🎨	#FF6B9D	6	t	2026-03-08 10:38:17.806478	2026-03-08 10:38:17.806478
7	Educación Física	Deportes, salud y actividad física	⚽	#4A90E2	7	t	2026-03-08 10:38:17.806478	2026-03-08 10:38:17.806478
\.


--
-- Data for Name: units; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.units (id, title, description, world_id, course_id, order_index, difficulty, cover_image_url, is_active, created_at, updated_at) FROM stdin;
1	Números y Conteo	\N	1	\N	0	1	\N	t	2026-03-08 10:38:17.850238	2026-03-08 10:38:17.850238
2	Letras y Sonidos	\N	2	\N	0	1	\N	t	2026-03-08 10:38:17.864351	2026-03-08 10:38:17.864351
3	La Gran Demo	Prueba las 10 mecánicas del motor educativo	5	\N	1	1	\N	t	2026-03-08 10:38:18.273559	2026-03-08 10:38:18.273559
4	Números y Conteos	Aprende contando con magia	9	\N	1	1	\N	t	2026-03-09 17:57:18.624945	2026-03-09 17:57:18.624945
\.


--
-- Data for Name: user_achievements; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.user_achievements (id, user_id, achievement_id, unlocked_at, progress_current, progress_target, is_claimed, created_at) FROM stdin;
\.


--
-- Data for Name: user_exercise_results; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.user_exercise_results (id, user_id, exercise_id, unit_id, is_correct, response_time_ms, attempt_number, user_answer, xp_earned, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_inventory; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.user_inventory (id, user_id, item_id, is_equipped, acquired_at) FROM stdin;
\.


--
-- Data for Name: user_level_progress; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.user_level_progress (id, user_id, level_id, is_completed, stars_earned, exercises_completed, total_exercises, is_unlocked, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.users (id, academic_level, placement_test_taken, role_id, center_id, parent_id, class_id, username, student_code, password_hash, email, first_name, last_name, phone, birth_date, avatar_id, equipped_frame_id, equipped_theme_id, language_code, is_active, last_login_at, last_login_ip, created_at, updated_at, deleted_at) FROM stdin;
1	beginner	f	3	1	\N	\N	teacher.maría1	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	maría.garcía@bestkids.com	María	García López	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.061165	2026-03-08 10:38:18.061165	\N
2	beginner	f	3	2	\N	\N	teacher.josé2	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	josé.martínez@bestkids.com	José	Martínez Ruiz	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.061165	2026-03-08 10:38:18.061165	\N
3	beginner	f	3	3	\N	\N	teacher.carmen3	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	carmen.fernández@bestkids.com	Carmen	Fernández Sánchez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.061165	2026-03-08 10:38:18.061165	\N
4	beginner	f	3	4	\N	\N	teacher.antonio4	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	antonio.gonzález@bestkids.com	Antonio	González Pérez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.061165	2026-03-08 10:38:18.061165	\N
5	beginner	f	3	5	\N	\N	teacher.isabel5	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	isabel.rodríguez@bestkids.com	Isabel	Rodríguez Moreno	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.061165	2026-03-08 10:38:18.061165	\N
6	beginner	f	3	1	\N	\N	teacher.francisco6	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	francisco.lópez@bestkids.com	Francisco	López Jiménez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.061165	2026-03-08 10:38:18.061165	\N
7	beginner	f	3	2	\N	\N	teacher.ana7	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	ana.hernández@bestkids.com	Ana	Hernández Díaz	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.061165	2026-03-08 10:38:18.061165	\N
8	beginner	f	3	3	\N	\N	teacher.manuel8	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	manuel.sánchez@bestkids.com	Manuel	Sánchez Romero	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.061165	2026-03-08 10:38:18.061165	\N
9	beginner	f	3	4	\N	\N	teacher.pilar9	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	pilar.ruiz@bestkids.com	Pilar	Ruiz Torres	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.061165	2026-03-08 10:38:18.061165	\N
10	beginner	f	3	5	\N	\N	teacher.david10	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	david.jiménez@bestkids.com	David	Jiménez Navarro	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.061165	2026-03-08 10:38:18.061165	\N
11	beginner	f	3	1	\N	\N	teacher.laura11	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	laura.moreno@bestkids.com	Laura	Moreno Castro	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.061165	2026-03-08 10:38:18.061165	\N
12	beginner	f	3	2	\N	\N	teacher.carlos12	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	carlos.álvarez@bestkids.com	Carlos	Álvarez Ortiz	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.061165	2026-03-08 10:38:18.061165	\N
13	beginner	f	3	3	\N	\N	teacher.elena13	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	elena.romero@bestkids.com	Elena	Romero Delgado	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.061165	2026-03-08 10:38:18.061165	\N
14	beginner	f	3	4	\N	\N	teacher.javier14	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	javier.torres@bestkids.com	Javier	Torres Vega	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.061165	2026-03-08 10:38:18.061165	\N
15	beginner	f	3	5	\N	\N	teacher.marta15	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	marta.ramírez@bestkids.com	Marta	Ramírez Molina	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.061165	2026-03-08 10:38:18.061165	\N
16	beginner	f	3	1	\N	\N	teacher.pedro16	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	pedro.serrano@bestkids.com	Pedro	Serrano Gil	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.061165	2026-03-08 10:38:18.061165	\N
17	beginner	f	3	2	\N	\N	teacher.lucía17	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	lucía.blanco@bestkids.com	Lucía	Blanco Medina	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.061165	2026-03-08 10:38:18.061165	\N
18	beginner	f	3	3	\N	\N	teacher.miguel18	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	miguel.castro@bestkids.com	Miguel	Castro Ortega	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.061165	2026-03-08 10:38:18.061165	\N
19	beginner	f	3	4	\N	\N	teacher.sara19	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	sara.vargas@bestkids.com	Sara	Vargas Ramos	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.061165	2026-03-08 10:38:18.061165	\N
20	beginner	f	3	5	\N	\N	teacher.raúl20	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	raúl.iglesias@bestkids.com	Raúl	Iglesias Herrera	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.061165	2026-03-08 10:38:18.061165	\N
21	beginner	f	4	1	\N	\N	parent.alberto1	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	alberto.ruiz@email.com	Alberto	Ruiz	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
22	beginner	f	4	2	\N	\N	parent.beatriz2	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	beatriz.soto@email.com	Beatriz	Soto	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
23	beginner	f	4	3	\N	\N	parent.carlos3	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	carlos.vega@email.com	Carlos	Vega	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
24	beginner	f	4	4	\N	\N	parent.diana4	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	diana.mora@email.com	Diana	Mora	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
25	beginner	f	4	5	\N	\N	parent.eduardo5	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	eduardo.gil@email.com	Eduardo	Gil	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
26	beginner	f	4	1	\N	\N	parent.francisca6	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	francisca.ortiz@email.com	Francisca	Ortiz	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
27	beginner	f	4	2	\N	\N	parent.gonzalo7	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	gonzalo.ramos@email.com	Gonzalo	Ramos	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
28	beginner	f	4	3	\N	\N	parent.helena8	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	helena.castro@email.com	Helena	Castro	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
29	beginner	f	4	4	\N	\N	parent.ignacio9	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	ignacio.herrera@email.com	Ignacio	Herrera	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
30	beginner	f	4	5	\N	\N	parent.julia10	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	julia.medina@email.com	Julia	Medina	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
31	beginner	f	4	1	\N	\N	parent.luis11	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	luis.navarro@email.com	Luis	Navarro	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
32	beginner	f	4	2	\N	\N	parent.mónica12	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	mónica.delgado@email.com	Mónica	Delgado	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
33	beginner	f	4	3	\N	\N	parent.nicolás13	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	nicolás.ortega@email.com	Nicolás	Ortega	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
34	beginner	f	4	4	\N	\N	parent.olivia14	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	olivia.molina@email.com	Olivia	Molina	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
35	beginner	f	4	5	\N	\N	parent.pablo15	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	pablo.serrano@email.com	Pablo	Serrano	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
36	beginner	f	4	1	\N	\N	parent.raquel16	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	raquel.blanco@email.com	Raquel	Blanco	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
37	beginner	f	4	2	\N	\N	parent.sergio17	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	sergio.iglesias@email.com	Sergio	Iglesias	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
38	beginner	f	4	3	\N	\N	parent.teresa18	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	teresa.vargas@email.com	Teresa	Vargas	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
39	beginner	f	4	4	\N	\N	parent.víctor19	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	víctor.romero@email.com	Víctor	Romero	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
40	beginner	f	4	5	\N	\N	parent.yolanda20	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	yolanda.torres@email.com	Yolanda	Torres	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
41	beginner	f	4	1	\N	\N	parent.adrián21	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	adrián.jiménez@email.com	Adrián	Jiménez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
42	beginner	f	4	2	\N	\N	parent.belén22	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	belén.moreno@email.com	Belén	Moreno	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
43	beginner	f	4	3	\N	\N	parent.cristina23	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	cristina.álvarez@email.com	Cristina	Álvarez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
44	beginner	f	4	4	\N	\N	parent.daniel24	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	daniel.sánchez@email.com	Daniel	Sánchez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
45	beginner	f	4	5	\N	\N	parent.eva25	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	eva.hernández@email.com	Eva	Hernández	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
46	beginner	f	4	1	\N	\N	parent.fernando26	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	fernando.lópez@email.com	Fernando	López	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
47	beginner	f	4	2	\N	\N	parent.gloria27	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	gloria.rodríguez@email.com	Gloria	Rodríguez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
48	beginner	f	4	3	\N	\N	parent.hugo28	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	hugo.gonzález@email.com	Hugo	González	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
49	beginner	f	4	4	\N	\N	parent.inés29	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	inés.fernández@email.com	Inés	Fernández	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
50	beginner	f	4	5	\N	\N	parent.jorge30	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	jorge.martínez@email.com	Jorge	Martínez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.077578	2026-03-08 10:38:18.077578	\N
51	beginner	f	5	1	21	\N	student.lucas1	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	lucas.garcía0@student.bestkids.com	Lucas	García	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
52	beginner	f	5	2	21	\N	student.emma2	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	emma.martínez1@student.bestkids.com	Emma	Martínez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
53	beginner	f	5	3	22	\N	student.mateo3	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	mateo.lópez2@student.bestkids.com	Mateo	López	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
54	beginner	f	5	4	22	\N	student.sofía4	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	sofía.sánchez3@student.bestkids.com	Sofía	Sánchez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
55	beginner	f	5	5	23	\N	student.hugo5	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	hugo.gonzález4@student.bestkids.com	Hugo	González	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
56	beginner	f	5	1	23	\N	student.martina6	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	martina.pérez5@student.bestkids.com	Martina	Pérez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
57	beginner	f	5	2	24	\N	student.leo7	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	leo.rodríguez6@student.bestkids.com	Leo	Rodríguez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
58	beginner	f	5	3	24	\N	student.lucía8	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	lucía.fernández7@student.bestkids.com	Lucía	Fernández	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
59	beginner	f	5	4	25	\N	student.daniel9	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	daniel.gómez8@student.bestkids.com	Daniel	Gómez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
60	beginner	f	5	5	25	\N	student.maría10	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	maría.díaz9@student.bestkids.com	María	Díaz	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
61	beginner	f	5	1	26	\N	student.pablo11	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	pablo.ruiz10@student.bestkids.com	Pablo	Ruiz	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
62	beginner	f	5	2	26	\N	student.paula12	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	paula.hernández11@student.bestkids.com	Paula	Hernández	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
63	beginner	f	5	3	27	\N	student.alejandro13	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	alejandro.jiménez12@student.bestkids.com	Alejandro	Jiménez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
64	beginner	f	5	4	27	\N	student.valeria14	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	valeria.moreno13@student.bestkids.com	Valeria	Moreno	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
65	beginner	f	5	5	28	\N	student.álvaro15	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	álvaro.álvarez14@student.bestkids.com	Álvaro	Álvarez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
66	beginner	f	5	1	28	\N	student.carmen16	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	carmen.romero15@student.bestkids.com	Carmen	Romero	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
67	beginner	f	5	2	29	\N	student.adrián17	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	adrián.garcía16@student.bestkids.com	Adrián	García	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
68	beginner	f	5	3	29	\N	student.carla18	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	carla.martínez17@student.bestkids.com	Carla	Martínez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
69	beginner	f	5	4	30	\N	student.diego19	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	diego.lópez18@student.bestkids.com	Diego	López	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
70	beginner	f	5	5	30	\N	student.ana20	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	ana.sánchez19@student.bestkids.com	Ana	Sánchez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
71	beginner	f	5	1	31	\N	student.mario21	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	mario.gonzález20@student.bestkids.com	Mario	González	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
72	beginner	f	5	2	31	\N	student.elena22	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	elena.pérez21@student.bestkids.com	Elena	Pérez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
73	beginner	f	5	3	32	\N	student.javier23	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	javier.rodríguez22@student.bestkids.com	Javier	Rodríguez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
74	beginner	f	5	4	32	\N	student.laura24	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	laura.fernández23@student.bestkids.com	Laura	Fernández	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
75	beginner	f	5	5	33	\N	student.manuel25	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	manuel.gómez24@student.bestkids.com	Manuel	Gómez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
76	beginner	f	5	1	33	\N	student.claudia26	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	claudia.díaz25@student.bestkids.com	Claudia	Díaz	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
77	beginner	f	5	2	34	\N	student.sergio27	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	sergio.ruiz26@student.bestkids.com	Sergio	Ruiz	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
78	beginner	f	5	3	34	\N	student.noa28	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	noa.hernández27@student.bestkids.com	Noa	Hernández	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
79	beginner	f	5	4	35	\N	student.iker29	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	iker.jiménez28@student.bestkids.com	Iker	Jiménez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
80	beginner	f	5	5	35	\N	student.julia30	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	julia.moreno29@student.bestkids.com	Julia	Moreno	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
81	beginner	f	5	1	36	\N	student.marc31	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	marc.álvarez30@student.bestkids.com	Marc	Álvarez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
82	beginner	f	5	2	36	\N	student.alba32	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	alba.romero31@student.bestkids.com	Alba	Romero	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
83	beginner	f	5	3	37	\N	student.gonzalo33	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	gonzalo.garcía32@student.bestkids.com	Gonzalo	García	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
84	beginner	f	5	4	37	\N	student.marta34	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	marta.martínez33@student.bestkids.com	Marta	Martínez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
85	beginner	f	5	5	38	\N	student.rubén35	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	rubén.lópez34@student.bestkids.com	Rubén	López	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
86	beginner	f	5	1	38	\N	student.sara36	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	sara.sánchez35@student.bestkids.com	Sara	Sánchez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
87	beginner	f	5	2	39	\N	student.nicolás37	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	nicolás.gonzález36@student.bestkids.com	Nicolás	González	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
88	beginner	f	5	3	39	\N	student.daniela38	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	daniela.pérez37@student.bestkids.com	Daniela	Pérez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
89	beginner	f	5	4	40	\N	student.marcos39	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	marcos.rodríguez38@student.bestkids.com	Marcos	Rodríguez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
90	beginner	f	5	5	40	\N	student.irene40	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	irene.fernández39@student.bestkids.com	Irene	Fernández	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
91	beginner	f	5	1	41	\N	student.raúl41	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	raúl.gómez40@student.bestkids.com	Raúl	Gómez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
92	beginner	f	5	2	41	\N	student.andrea42	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	andrea.díaz41@student.bestkids.com	Andrea	Díaz	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
93	beginner	f	5	3	42	\N	student.antonio43	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	antonio.ruiz42@student.bestkids.com	Antonio	Ruiz	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
94	beginner	f	5	4	42	\N	student.natalia44	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	natalia.hernández43@student.bestkids.com	Natalia	Hernández	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
95	beginner	f	5	5	43	\N	student.carlos45	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	carlos.jiménez44@student.bestkids.com	Carlos	Jiménez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
96	beginner	f	5	1	43	\N	student.alicia46	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	alicia.moreno45@student.bestkids.com	Alicia	Moreno	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
97	beginner	f	5	2	44	\N	student.david47	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	david.álvarez46@student.bestkids.com	David	Álvarez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
98	beginner	f	5	3	44	\N	student.rocío48	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	rocío.romero47@student.bestkids.com	Rocío	Romero	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
99	beginner	f	5	4	45	\N	student.iván49	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	iván.garcía48@student.bestkids.com	Iván	García	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
100	beginner	f	5	5	45	\N	student.clara50	\N	$2b$10$kfjb3xX9.4AGth8BXuajE.t5ruJ/m8Ya0/m2X4rz.WhGfBIztsYaa	clara.martínez49@student.bestkids.com	Clara	Martínez	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.103997	2026-03-08 10:38:18.103997	\N
101	beginner	f	1	\N	\N	\N	master	\N	$2b$10$K8XL9XMc6q06JKXR1CJGXODqeS2WjKd7ut8tAYDVhR3d6AQj0ecga	master@bestkids.com	Master	System	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.199219	2026-03-08 10:38:18.199219	\N
102	beginner	f	2	1	\N	\N	admin	\N	$2b$10$K8XL9XMc6q06JKXR1CJGXODqeS2WjKd7ut8tAYDVhR3d6AQj0ecga	admin@bestkids.com	Admin	Centro	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.203016	2026-03-08 10:38:18.203016	\N
103	beginner	f	3	1	\N	\N	teacher1	\N	$2b$10$K8XL9XMc6q06JKXR1CJGXODqeS2WjKd7ut8tAYDVhR3d6AQj0ecga	teacher1@bestkids.com	Profesor	Prueba	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.204211	2026-03-08 10:38:18.204211	\N
104	beginner	f	4	1	\N	\N	parent1	\N	$2b$10$K8XL9XMc6q06JKXR1CJGXODqeS2WjKd7ut8tAYDVhR3d6AQj0ecga	parent1@bestkids.com	Padre	Prueba	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.205361	2026-03-08 10:38:18.205361	\N
105	beginner	f	5	1	104	\N	student1	BK-TEST1	$2b$10$K8XL9XMc6q06JKXR1CJGXODqeS2WjKd7ut8tAYDVhR3d6AQj0ecga	student1@bestkids.com	Estudiante	Prueba	\N	\N	\N	\N	\N	es	t	\N	\N	2026-03-08 10:38:18.206154	2026-03-08 10:38:18.206154	\N
\.


--
-- Data for Name: world_levels; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.world_levels (id, world_id, name, description, level_number, points_to_unlock, stars_required, is_active, created_at, updated_at) FROM stdin;
1	3	Nivel 1	Desafíos históricos/idiomáticos 1	1	0	0	t	2026-03-08 10:38:18.239981	2026-03-08 10:38:18.239981
2	3	Nivel 2	Desafíos históricos/idiomáticos 2	2	200	3	t	2026-03-08 10:38:18.2435	2026-03-08 10:38:18.2435
3	3	Nivel 3	Desafíos históricos/idiomáticos 3	3	400	3	t	2026-03-08 10:38:18.245361	2026-03-08 10:38:18.245361
4	3	Nivel 4	Desafíos históricos/idiomáticos 4	4	600	3	t	2026-03-08 10:38:18.246734	2026-03-08 10:38:18.246734
5	3	Nivel 5	Desafíos históricos/idiomáticos 5	5	800	3	t	2026-03-08 10:38:18.247984	2026-03-08 10:38:18.247984
6	4	Nivel 1	Desafíos históricos/idiomáticos 1	1	0	0	t	2026-03-08 10:38:18.254419	2026-03-08 10:38:18.254419
7	4	Nivel 2	Desafíos históricos/idiomáticos 2	2	200	3	t	2026-03-08 10:38:18.255499	2026-03-08 10:38:18.255499
8	4	Nivel 3	Desafíos históricos/idiomáticos 3	3	400	3	t	2026-03-08 10:38:18.256794	2026-03-08 10:38:18.256794
9	4	Nivel 4	Desafíos históricos/idiomáticos 4	4	600	3	t	2026-03-08 10:38:18.260363	2026-03-08 10:38:18.260363
10	4	Nivel 5	Desafíos históricos/idiomáticos 5	5	800	3	t	2026-03-08 10:38:18.261895	2026-03-08 10:38:18.261895
\.


--
-- Data for Name: worlds; Type: TABLE DATA; Schema: public; Owner: bestkids_user
--

COPY public.worlds (id, name, description, icon, background_image, color_theme, order_index, points_to_unlock, is_active, subject_area_id, created_at, updated_at) FROM stdin;
1	Matemáticas	El mundo de los números y la lógica	\N	\N	#4A90E2	0	0	t	\N	2026-03-08 10:38:17.834798	2026-03-08 10:38:17.834798
2	Lenguaje	Explora el poder de las palabras	\N	\N	#F5A623	1	0	t	\N	2026-03-08 10:38:17.839051	2026-03-08 10:38:17.839051
3	🏛️ Imperio de la Historia	Viaja en el tiempo y descubre el pasado de la humanidad	⏳	\N	#F5A623	5	2000	t	4	2026-03-08 10:38:18.239224	2026-03-08 10:38:18.239224
4	🇬🇧 Archipiélago de Inglés	Domina el idioma universal en islas llenas de retos	🚢	\N	#BD10E0	6	3000	t	5	2026-03-08 10:38:18.252248	2026-03-08 10:38:18.252248
5	Aventura Multimedia	Explora todos los tipos de ejercicios mecánicos	🌟	\N	#A855F7	1	0	t	\N	2026-03-08 10:38:18.272592	2026-03-08 10:38:18.272592
9	Mundo Matemático	Mundo de las mates	\N	\N	#4A90E2	1	0	t	1	2026-03-09 17:57:18.624945	2026-03-09 17:57:18.624945
\.


--
-- Name: achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.achievements_id_seq', 1, false);


--
-- Name: adaptive_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.adaptive_progress_id_seq', 1, false);


--
-- Name: area_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.area_progress_id_seq', 1, false);


--
-- Name: assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.assignments_id_seq', 1, false);


--
-- Name: avatars_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.avatars_id_seq', 4, true);


--
-- Name: centers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.centers_id_seq', 5, true);


--
-- Name: classes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.classes_id_seq', 1, false);


--
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.courses_id_seq', 1, false);


--
-- Name: exercise_attempts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.exercise_attempts_id_seq', 1, false);


--
-- Name: exercise_options_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.exercise_options_id_seq', 1, false);


--
-- Name: exercises_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.exercises_id_seq', 24, true);


--
-- Name: feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.feedback_id_seq', 1, false);


--
-- Name: gamification_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.gamification_profiles_id_seq', 1, true);


--
-- Name: initial_assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.initial_assessments_id_seq', 1, false);


--
-- Name: level_exercises_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.level_exercises_id_seq', 1, false);


--
-- Name: mentoring_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.mentoring_sessions_id_seq', 1, false);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.messages_id_seq', 1, false);


--
-- Name: moderation_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.moderation_reports_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: resources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.resources_id_seq', 3, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.roles_id_seq', 5, true);


--
-- Name: store_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.store_items_id_seq', 10, true);


--
-- Name: student_tutors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.student_tutors_id_seq', 1, false);


--
-- Name: subject_areas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.subject_areas_id_seq', 7, true);


--
-- Name: units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.units_id_seq', 4, true);


--
-- Name: user_achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.user_achievements_id_seq', 1, false);


--
-- Name: user_exercise_results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.user_exercise_results_id_seq', 1, false);


--
-- Name: user_inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.user_inventory_id_seq', 1, false);


--
-- Name: user_level_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.user_level_progress_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.users_id_seq', 105, true);


--
-- Name: world_levels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.world_levels_id_seq', 10, true);


--
-- Name: worlds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bestkids_user
--

SELECT pg_catalog.setval('public.worlds_id_seq', 9, true);


--
-- Name: store_items PK_0d47463134b9663b18d7df22282; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.store_items
    ADD CONSTRAINT "PK_0d47463134b9663b18d7df22282" PRIMARY KEY (id);


--
-- Name: user_level_progress PK_120032b1a1bb84e2c36d83b97aa; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.user_level_progress
    ADD CONSTRAINT "PK_120032b1a1bb84e2c36d83b97aa" PRIMARY KEY (id);


--
-- Name: messages PK_18325f38ae6de43878487eff986; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY (id);


--
-- Name: user_inventory PK_193d6e1b301eda020c2492d3d9c; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.user_inventory
    ADD CONSTRAINT "PK_193d6e1b301eda020c2492d3d9c" PRIMARY KEY (id);


--
-- Name: world_levels PK_1a941a61babac5dcd63160429e7; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.world_levels
    ADD CONSTRAINT "PK_1a941a61babac5dcd63160429e7" PRIMARY KEY (id);


--
-- Name: achievements PK_1bc19c37c6249f70186f318d71d; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT "PK_1bc19c37c6249f70186f318d71d" PRIMARY KEY (id);


--
-- Name: area_progress PK_1c4ec44ab8134a9fe37a76e7288; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.area_progress
    ADD CONSTRAINT "PK_1c4ec44ab8134a9fe37a76e7288" PRIMARY KEY (id);


--
-- Name: avatars PK_224de7bae2014a1557cd9930ed7; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.avatars
    ADD CONSTRAINT "PK_224de7bae2014a1557cd9930ed7" PRIMARY KEY (id);


--
-- Name: exercise_options PK_39a6564f867d8c3dde816919b4a; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.exercise_options
    ADD CONSTRAINT "PK_39a6564f867d8c3dde816919b4a" PRIMARY KEY (id);


--
-- Name: user_achievements PK_3d94aba7e9ed55365f68b5e77fa; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT "PK_3d94aba7e9ed55365f68b5e77fa" PRIMARY KEY (id);


--
-- Name: courses PK_3f70a487cc718ad8eda4e6d58c9; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY (id);


--
-- Name: level_exercises PK_4274973a25d811dce9ccdf69e59; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.level_exercises
    ADD CONSTRAINT "PK_4274973a25d811dce9ccdf69e59" PRIMARY KEY (id);


--
-- Name: exercise_attempts PK_46e3668ece934b5914dd18502cf; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.exercise_attempts
    ADD CONSTRAINT "PK_46e3668ece934b5914dd18502cf" PRIMARY KEY (id);


--
-- Name: units PK_5a8f2f064919b587d93936cb223; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT "PK_5a8f2f064919b587d93936cb223" PRIMARY KEY (id);


--
-- Name: resources PK_632484ab9dff41bba94f9b7c85e; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT "PK_632484ab9dff41bba94f9b7c85e" PRIMARY KEY (id);


--
-- Name: centers PK_692e2318139b8148445f33c2880; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.centers
    ADD CONSTRAINT "PK_692e2318139b8148445f33c2880" PRIMARY KEY (id);


--
-- Name: notifications PK_6a72c3c0f683f6462415e653c3a; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY (id);


--
-- Name: feedback PK_8389f9e087a57689cd5be8b2b13; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13" PRIMARY KEY (id);


--
-- Name: adaptive_progress PK_85ea46c32d777dd246591cc885b; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.adaptive_progress
    ADD CONSTRAINT "PK_85ea46c32d777dd246591cc885b" PRIMARY KEY (id);


--
-- Name: worlds PK_8b447f7a2b28d3567db893ae7a6; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.worlds
    ADD CONSTRAINT "PK_8b447f7a2b28d3567db893ae7a6" PRIMARY KEY (id);


--
-- Name: mentoring_sessions PK_8ce3ec85cbac78813679b7c1f67; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.mentoring_sessions
    ADD CONSTRAINT "PK_8ce3ec85cbac78813679b7c1f67" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: moderation_reports PK_a40784ec3803830fe974b4b85fb; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.moderation_reports
    ADD CONSTRAINT "PK_a40784ec3803830fe974b4b85fb" PRIMARY KEY (id);


--
-- Name: gamification_profiles PK_ac8840b02ebe197c4562ca573fc; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.gamification_profiles
    ADD CONSTRAINT "PK_ac8840b02ebe197c4562ca573fc" PRIMARY KEY (id);


--
-- Name: subject_areas PK_bb3f9df67b26fe54dc9b003ac60; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.subject_areas
    ADD CONSTRAINT "PK_bb3f9df67b26fe54dc9b003ac60" PRIMARY KEY (id);


--
-- Name: roles PK_c1433d71a4838793a49dcad46ab; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY (id);


--
-- Name: exercises PK_c4c46f5fa89a58ba7c2d894e3c3; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT "PK_c4c46f5fa89a58ba7c2d894e3c3" PRIMARY KEY (id);


--
-- Name: assignments PK_c54ca359535e0012b04dcbd80ee; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT "PK_c54ca359535e0012b04dcbd80ee" PRIMARY KEY (id);


--
-- Name: user_exercise_results PK_c6c20e8dd1ae5e356ef04bcc61b; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.user_exercise_results
    ADD CONSTRAINT "PK_c6c20e8dd1ae5e356ef04bcc61b" PRIMARY KEY (id);


--
-- Name: initial_assessments PK_c81bdc595bae10b0d62e6f88b5a; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.initial_assessments
    ADD CONSTRAINT "PK_c81bdc595bae10b0d62e6f88b5a" PRIMARY KEY (id);


--
-- Name: classes PK_e207aa15404e9b2ce35910f9f7f; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT "PK_e207aa15404e9b2ce35910f9f7f" PRIMARY KEY (id);


--
-- Name: student_tutors PK_feb03858a1358eef83a366dda35; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.student_tutors
    ADD CONSTRAINT "PK_feb03858a1358eef83a366dda35" PRIMARY KEY (id);


--
-- Name: student_tutors UQ_2e6ca04d9ab077b096f360e719f; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.student_tutors
    ADD CONSTRAINT "UQ_2e6ca04d9ab077b096f360e719f" UNIQUE (student_id, tutor_id);


--
-- Name: roles UQ_648e3f5447f725579d7d4ffdfb7; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE (name);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: users UQ_9be1df94aa1ef231ce18f4f11cd; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_9be1df94aa1ef231ce18f4f11cd" UNIQUE (student_code);


--
-- Name: centers UQ_b439fe86278d1293316efb3ae06; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.centers
    ADD CONSTRAINT "UQ_b439fe86278d1293316efb3ae06" UNIQUE (code);


--
-- Name: gamification_profiles UQ_b88717e71a6fa66b00807e0f6c8; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.gamification_profiles
    ADD CONSTRAINT "UQ_b88717e71a6fa66b00807e0f6c8" UNIQUE (user_id);


--
-- Name: users UQ_fe0bb3f6520ee0469504521e710; Type: CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE (username);


--
-- Name: IDX_0372533220ea48efd136c33578; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_0372533220ea48efd136c33578" ON public.users USING btree (class_id);


--
-- Name: IDX_03b7ad8596195af69eb1903411; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_03b7ad8596195af69eb1903411" ON public.users USING btree (parent_id);


--
-- Name: IDX_0586f79b0af1353ade17fa3b79; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_0586f79b0af1353ade17fa3b79" ON public.worlds USING btree (order_index);


--
-- Name: IDX_093bbd50143e640f5608e3758a; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_093bbd50143e640f5608e3758a" ON public.worlds USING btree (subject_area_id);


--
-- Name: IDX_22133395bd13b970ccd0c34ab2; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_22133395bd13b970ccd0c34ab2" ON public.messages USING btree (sender_id);


--
-- Name: IDX_252292e567dfbc83b97016c3d6; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_252292e567dfbc83b97016c3d6" ON public.user_level_progress USING btree (level_id);


--
-- Name: IDX_2720f08c955db201884e13c5af; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_2720f08c955db201884e13c5af" ON public.subject_areas USING btree (is_active);


--
-- Name: IDX_27322fa090b5deacc5785fcb94; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_27322fa090b5deacc5785fcb94" ON public.assignments USING btree (teacher_id);


--
-- Name: IDX_2d2c34f5fcdf2e57465ebeb0b9; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_2d2c34f5fcdf2e57465ebeb0b9" ON public.exercise_attempts USING btree (exercise_id);


--
-- Name: IDX_32d9ec67b20dc1c1d1a883dd1e; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_32d9ec67b20dc1c1d1a883dd1e" ON public.units USING btree (course_id);


--
-- Name: IDX_36b4a912357ad1342b735d4d4c; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_36b4a912357ad1342b735d4d4c" ON public.user_achievements USING btree (achievement_id);


--
-- Name: IDX_40ec4dea118345e4d95fb836ad; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_40ec4dea118345e4d95fb836ad" ON public.users USING btree (last_login_at);


--
-- Name: IDX_41a418680bb4376688a8a5d7f3; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_41a418680bb4376688a8a5d7f3" ON public.assignments USING btree (student_id, status);


--
-- Name: IDX_4355054fdcdada5960bfcf8332; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_4355054fdcdada5960bfcf8332" ON public.user_level_progress USING btree (user_id);


--
-- Name: IDX_4a270959307c2d584b4f5b1421; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_4a270959307c2d584b4f5b1421" ON public.achievements USING btree (category);


--
-- Name: IDX_51d95c7348c00927c65d61fdf8; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_51d95c7348c00927c65d61fdf8" ON public.classes USING btree (center_id);


--
-- Name: IDX_524bd4a6b17d32c5ec6e1e87e5; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_524bd4a6b17d32c5ec6e1e87e5" ON public.exercise_attempts USING btree (user_id, created_at);


--
-- Name: IDX_566c3d68184e83d4307b86f85a; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_566c3d68184e83d4307b86f85a" ON public.messages USING btree (recipient_id);


--
-- Name: IDX_59557bd882f24d54566ca1dc4d; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_59557bd882f24d54566ca1dc4d" ON public.gamification_profiles USING btree (last_activity_date);


--
-- Name: IDX_5b75a4a33c343e5f2973879d7f; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_5b75a4a33c343e5f2973879d7f" ON public.area_progress USING btree (user_id);


--
-- Name: IDX_5f58fae7b3ac70e8cb4bb11f04; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_5f58fae7b3ac70e8cb4bb11f04" ON public.achievements USING btree (type, category);


--
-- Name: IDX_6261fe3636483beee9db8fd370; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_6261fe3636483beee9db8fd370" ON public.achievements USING btree (type);


--
-- Name: IDX_648e3f5447f725579d7d4ffdfb; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_648e3f5447f725579d7d4ffdfb" ON public.roles USING btree (name);


--
-- Name: IDX_6a6a21eca63af52771675d3c81; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_6a6a21eca63af52771675d3c81" ON public.users USING btree (center_id);


--
-- Name: IDX_72cde5f6149304d9f66a926b40; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_72cde5f6149304d9f66a926b40" ON public.gamification_profiles USING btree (total_points);


--
-- Name: IDX_7370dad951fb023e4466364157; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_7370dad951fb023e4466364157" ON public.level_exercises USING btree (exercise_id);


--
-- Name: IDX_7dad5b5267533e501f7d3431dc; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_7dad5b5267533e501f7d3431dc" ON public.assignments USING btree (student_id);


--
-- Name: IDX_7fdbf1baeb91b6f822b5d57e19; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE UNIQUE INDEX "IDX_7fdbf1baeb91b6f822b5d57e19" ON public.users USING btree (email) WHERE (deleted_at IS NULL);


--
-- Name: IDX_802c38988119de35d3cd8e6a84; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_802c38988119de35d3cd8e6a84" ON public.user_exercise_results USING btree (unit_id);


--
-- Name: IDX_8c892724c50e74afef1bf73e5f; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_8c892724c50e74afef1bf73e5f" ON public.units USING btree (world_id);


--
-- Name: IDX_8cbbccccacb49337a14251c740; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE UNIQUE INDEX "IDX_8cbbccccacb49337a14251c740" ON public.area_progress USING btree (user_id, subject_area_id);


--
-- Name: IDX_93415f4f43b9ee26b971049f55; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_93415f4f43b9ee26b971049f55" ON public.exercises USING btree (unit_id);


--
-- Name: IDX_93eb201c7a9603e415301e69a0; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_93eb201c7a9603e415301e69a0" ON public.messages USING btree (is_read);


--
-- Name: IDX_951fd419e8486c10ba6302a934; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_951fd419e8486c10ba6302a934" ON public.assignments USING btree (class_id);


--
-- Name: IDX_9a8a82462cab47c73d25f49261; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_9a8a82462cab47c73d25f49261" ON public.notifications USING btree (user_id);


--
-- Name: IDX_9ac24903c2473d08e1288c9a50; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_9ac24903c2473d08e1288c9a50" ON public.avatars USING btree (is_default);


--
-- Name: IDX_9b3eb0e86e4abb250951711b00; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_9b3eb0e86e4abb250951711b00" ON public.exercises USING btree (subject_area_id);


--
-- Name: IDX_a103993b75768d942744e4b3b4; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE UNIQUE INDEX "IDX_a103993b75768d942744e4b3b4" ON public.user_achievements USING btree (user_id, achievement_id);


--
-- Name: IDX_a1116f7091a2ae6c68c5689384; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_a1116f7091a2ae6c68c5689384" ON public.messages USING btree (recipient_id, is_read, created_at);


--
-- Name: IDX_a2cecd1a3531c0b041e29ba46e; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_a2cecd1a3531c0b041e29ba46e" ON public.users USING btree (role_id);


--
-- Name: IDX_a985e2166afbc341dc850d2dab; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_a985e2166afbc341dc850d2dab" ON public.world_levels USING btree (world_id);


--
-- Name: IDX_ad70dc51a10702dfd54407c2b4; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_ad70dc51a10702dfd54407c2b4" ON public.assignments USING btree (teacher_id, created_at);


--
-- Name: IDX_b34c92e413c4debb6e0f23fed4; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_b34c92e413c4debb6e0f23fed4" ON public.classes USING btree (teacher_id);


--
-- Name: IDX_b439fe86278d1293316efb3ae0; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_b439fe86278d1293316efb3ae0" ON public.centers USING btree (code);


--
-- Name: IDX_b88717e71a6fa66b00807e0f6c; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_b88717e71a6fa66b00807e0f6c" ON public.gamification_profiles USING btree (user_id);


--
-- Name: IDX_c755e3741cd46fc5ae3ef06592; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_c755e3741cd46fc5ae3ef06592" ON public.user_achievements USING btree (user_id);


--
-- Name: IDX_c8f7b8db6279b6177bc432350e; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_c8f7b8db6279b6177bc432350e" ON public.area_progress USING btree (subject_area_id);


--
-- Name: IDX_ce6063ba9705d8ce937dfee002; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_ce6063ba9705d8ce937dfee002" ON public.assignments USING btree (status);


--
-- Name: IDX_d1fdc53bc57d911dfeaa465a86; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_d1fdc53bc57d911dfeaa465a86" ON public.worlds USING btree (name);


--
-- Name: IDX_d585da3d991e15ae4a174e2882; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_d585da3d991e15ae4a174e2882" ON public.messages USING btree (sender_id, created_at);


--
-- Name: IDX_e0169a7625342afaf6ad53d581; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE UNIQUE INDEX "IDX_e0169a7625342afaf6ad53d581" ON public.users USING btree (username) WHERE (deleted_at IS NULL);


--
-- Name: IDX_e74aaed2d9b76fb9b2ea8f4641; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_e74aaed2d9b76fb9b2ea8f4641" ON public.achievements USING btree (is_active);


--
-- Name: IDX_eda1192767f29de5d1f056c860; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_eda1192767f29de5d1f056c860" ON public.user_exercise_results USING btree (user_id, exercise_id);


--
-- Name: IDX_f61e1f0b44cfcb638b30dc1594; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_f61e1f0b44cfcb638b30dc1594" ON public.gamification_profiles USING btree (current_level);


--
-- Name: IDX_f7e4b89b0b4ea5fcb91831737d; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_f7e4b89b0b4ea5fcb91831737d" ON public.level_exercises USING btree (level_id);


--
-- Name: IDX_f97a6b31255f678d27b1d21b9d; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_f97a6b31255f678d27b1d21b9d" ON public.exercise_attempts USING btree (user_id, exercise_id);


--
-- Name: IDX_fb974487ff1c0e316c46010a8e; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_fb974487ff1c0e316c46010a8e" ON public.world_levels USING btree (level_number);


--
-- Name: IDX_fc2d57d61a08d6af2f5ede7ab2; Type: INDEX; Schema: public; Owner: bestkids_user
--

CREATE INDEX "IDX_fc2d57d61a08d6af2f5ede7ab2" ON public.exercise_attempts USING btree (user_id);


--
-- Name: users FK_0372533220ea48efd136c335789; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_0372533220ea48efd136c335789" FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: users FK_03b7ad8596195af69eb19034116; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_03b7ad8596195af69eb19034116" FOREIGN KEY (parent_id) REFERENCES public.users(id);


--
-- Name: feedback FK_121c67d42dd543cca0809f59901; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT "FK_121c67d42dd543cca0809f59901" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: adaptive_progress FK_1bc7a5d2bbca8d41a015ac9fc77; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.adaptive_progress
    ADD CONSTRAINT "FK_1bc7a5d2bbca8d41a015ac9fc77" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: assignments FK_1d5bfe3af111f7cce7d4d3afa96; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT "FK_1d5bfe3af111f7cce7d4d3afa96" FOREIGN KEY (exercise_id) REFERENCES public.exercises(id);


--
-- Name: messages FK_22133395bd13b970ccd0c34ab22; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "FK_22133395bd13b970ccd0c34ab22" FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- Name: student_tutors FK_22286f87d53c267c97e3a731fe2; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.student_tutors
    ADD CONSTRAINT "FK_22286f87d53c267c97e3a731fe2" FOREIGN KEY (student_id) REFERENCES public.users(id);


--
-- Name: user_level_progress FK_252292e567dfbc83b97016c3d60; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.user_level_progress
    ADD CONSTRAINT "FK_252292e567dfbc83b97016c3d60" FOREIGN KEY (level_id) REFERENCES public.world_levels(id);


--
-- Name: assignments FK_27322fa090b5deacc5785fcb94c; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT "FK_27322fa090b5deacc5785fcb94c" FOREIGN KEY (teacher_id) REFERENCES public.users(id);


--
-- Name: moderation_reports FK_2a75fb514f2d13b13616066fd20; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.moderation_reports
    ADD CONSTRAINT "FK_2a75fb514f2d13b13616066fd20" FOREIGN KEY (reporter_id) REFERENCES public.users(id);


--
-- Name: exercise_attempts FK_2d2c34f5fcdf2e57465ebeb0b9e; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.exercise_attempts
    ADD CONSTRAINT "FK_2d2c34f5fcdf2e57465ebeb0b9e" FOREIGN KEY (exercise_id) REFERENCES public.exercises(id);


--
-- Name: user_inventory FK_3233e26c68f0e1684ffd938edec; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.user_inventory
    ADD CONSTRAINT "FK_3233e26c68f0e1684ffd938edec" FOREIGN KEY (item_id) REFERENCES public.store_items(id);


--
-- Name: units FK_32d9ec67b20dc1c1d1a883dd1e6; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT "FK_32d9ec67b20dc1c1d1a883dd1e6" FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: user_achievements FK_36b4a912357ad1342b735d4d4c8; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT "FK_36b4a912357ad1342b735d4d4c8" FOREIGN KEY (achievement_id) REFERENCES public.achievements(id);


--
-- Name: user_level_progress FK_4355054fdcdada5960bfcf8332a; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.user_level_progress
    ADD CONSTRAINT "FK_4355054fdcdada5960bfcf8332a" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_inventory FK_4e23c453e03c0a8c71f83dabfda; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.user_inventory
    ADD CONSTRAINT "FK_4e23c453e03c0a8c71f83dabfda" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: classes FK_51d95c7348c00927c65d61fdf80; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT "FK_51d95c7348c00927c65d61fdf80" FOREIGN KEY (center_id) REFERENCES public.centers(id);


--
-- Name: messages FK_566c3d68184e83d4307b86f85ab; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "FK_566c3d68184e83d4307b86f85ab" FOREIGN KEY (recipient_id) REFERENCES public.users(id);


--
-- Name: adaptive_progress FK_590ef7260666897a80499302ac1; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.adaptive_progress
    ADD CONSTRAINT "FK_590ef7260666897a80499302ac1" FOREIGN KEY ("subjectAreaId") REFERENCES public.subject_areas(id);


--
-- Name: exercise_options FK_619f19aa742d2a259eb131144be; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.exercise_options
    ADD CONSTRAINT "FK_619f19aa742d2a259eb131144be" FOREIGN KEY (exercise_id) REFERENCES public.exercises(id);


--
-- Name: users FK_6a6a21eca63af52771675d3c810; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_6a6a21eca63af52771675d3c810" FOREIGN KEY (center_id) REFERENCES public.centers(id);


--
-- Name: messages FK_72ffa22d68b72a09d5700e4463f; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "FK_72ffa22d68b72a09d5700e4463f" FOREIGN KEY (parent_message_id) REFERENCES public.messages(id);


--
-- Name: level_exercises FK_7370dad951fb023e4466364157b; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.level_exercises
    ADD CONSTRAINT "FK_7370dad951fb023e4466364157b" FOREIGN KEY (exercise_id) REFERENCES public.exercises(id);


--
-- Name: assignments FK_7dad5b5267533e501f7d3431dcf; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT "FK_7dad5b5267533e501f7d3431dcf" FOREIGN KEY (student_id) REFERENCES public.users(id);


--
-- Name: user_exercise_results FK_802c38988119de35d3cd8e6a84b; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.user_exercise_results
    ADD CONSTRAINT "FK_802c38988119de35d3cd8e6a84b" FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- Name: units FK_8c892724c50e74afef1bf73e5fb; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT "FK_8c892724c50e74afef1bf73e5fb" FOREIGN KEY (world_id) REFERENCES public.worlds(id);


--
-- Name: exercises FK_93415f4f43b9ee26b971049f556; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT "FK_93415f4f43b9ee26b971049f556" FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- Name: assignments FK_951fd419e8486c10ba6302a934b; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT "FK_951fd419e8486c10ba6302a934b" FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: notifications FK_9a8a82462cab47c73d25f49261f; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: initial_assessments FK_9ef5b5e822e4ff9e85395f303d2; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.initial_assessments
    ADD CONSTRAINT "FK_9ef5b5e822e4ff9e85395f303d2" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: world_levels FK_a985e2166afbc341dc850d2dab9; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.world_levels
    ADD CONSTRAINT "FK_a985e2166afbc341dc850d2dab9" FOREIGN KEY (world_id) REFERENCES public.worlds(id);


--
-- Name: classes FK_b34c92e413c4debb6e0f23fed46; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT "FK_b34c92e413c4debb6e0f23fed46" FOREIGN KEY (teacher_id) REFERENCES public.users(id);


--
-- Name: gamification_profiles FK_b88717e71a6fa66b00807e0f6c8; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.gamification_profiles
    ADD CONSTRAINT "FK_b88717e71a6fa66b00807e0f6c8" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: mentoring_sessions FK_b97eff2b4111bd4019d0c6f69ab; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.mentoring_sessions
    ADD CONSTRAINT "FK_b97eff2b4111bd4019d0c6f69ab" FOREIGN KEY (tutor_id) REFERENCES public.users(id);


--
-- Name: mentoring_sessions FK_b9eb1fc0e6a2e0b0a9909986394; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.mentoring_sessions
    ADD CONSTRAINT "FK_b9eb1fc0e6a2e0b0a9909986394" FOREIGN KEY (student_id) REFERENCES public.users(id);


--
-- Name: initial_assessments FK_bebab511fc546a523c4f7167d0e; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.initial_assessments
    ADD CONSTRAINT "FK_bebab511fc546a523c4f7167d0e" FOREIGN KEY ("subjectAreaId") REFERENCES public.subject_areas(id);


--
-- Name: student_tutors FK_ca9f5bb82bd6e1ff0a8c36e757f; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.student_tutors
    ADD CONSTRAINT "FK_ca9f5bb82bd6e1ff0a8c36e757f" FOREIGN KEY (tutor_id) REFERENCES public.users(id);


--
-- Name: moderation_reports FK_ce5ff98b0e600f064272ad3731b; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.moderation_reports
    ADD CONSTRAINT "FK_ce5ff98b0e600f064272ad3731b" FOREIGN KEY (reported_user_id) REFERENCES public.users(id);


--
-- Name: resources FK_e53ebff79b93bd89fbe2b54a75f; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT "FK_e53ebff79b93bd89fbe2b54a75f" FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: user_exercise_results FK_ed4bf3f31f6ed024203b978db15; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.user_exercise_results
    ADD CONSTRAINT "FK_ed4bf3f31f6ed024203b978db15" FOREIGN KEY (exercise_id) REFERENCES public.exercises(id);


--
-- Name: user_exercise_results FK_f187cd7ed1e98418f6fff80d15f; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.user_exercise_results
    ADD CONSTRAINT "FK_f187cd7ed1e98418f6fff80d15f" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: level_exercises FK_f7e4b89b0b4ea5fcb91831737d5; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.level_exercises
    ADD CONSTRAINT "FK_f7e4b89b0b4ea5fcb91831737d5" FOREIGN KEY (level_id) REFERENCES public.world_levels(id);


--
-- Name: exercise_attempts FK_fc2d57d61a08d6af2f5ede7ab26; Type: FK CONSTRAINT; Schema: public; Owner: bestkids_user
--

ALTER TABLE ONLY public.exercise_attempts
    ADD CONSTRAINT "FK_fc2d57d61a08d6af2f5ede7ab26" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict xVroHdJnDoOIZnWMK8fBAQPvPw2ewguYGzbHoQ9YuyLFgcnQCWt34UuJOQeVq3Y

