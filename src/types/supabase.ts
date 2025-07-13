export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      concept_content: {
        Row: {
          approach_formula: string | null
          approach_steps: Json
          approach_title: string | null
          concept_id: string | null
          concept_name: string | null
          example_scenario: string
          example_title: string | null
          example_visual: string | null
          hook_content: string
          hook_title: string | null
          id: string
          nonexample_explanation: string
          nonexample_scenario: string
          nonexample_title: string | null
        }
        Insert: {
          approach_formula?: string | null
          approach_steps: Json
          approach_title?: string | null
          concept_id?: string | null
          concept_name?: string | null
          example_scenario: string
          example_title?: string | null
          example_visual?: string | null
          hook_content: string
          hook_title?: string | null
          id?: string
          nonexample_explanation: string
          nonexample_scenario: string
          nonexample_title?: string | null
        }
        Update: {
          approach_formula?: string | null
          approach_steps?: Json
          approach_title?: string | null
          concept_id?: string | null
          concept_name?: string | null
          example_scenario?: string
          example_title?: string | null
          example_visual?: string | null
          hook_content?: string
          hook_title?: string | null
          id?: string
          nonexample_explanation?: string
          nonexample_scenario?: string
          nonexample_title?: string | null
        }
        Relationships: []
      }
      exercise_attempts: {
        Row: {
          exercise_variation_id: string | null
          id: string
          is_complete: boolean | null
          is_remediation_attempt: boolean | null
          needs_remediation: boolean | null
          parent_attempt_id: string | null
          remediation_round: number | null
          student_response: string
          submitted_at: string | null
          thread_id: string | null
          user_id: string | null
        }
        Insert: {
          exercise_variation_id?: string | null
          id?: string
          is_complete?: boolean | null
          is_remediation_attempt?: boolean | null
          needs_remediation?: boolean | null
          parent_attempt_id?: string | null
          remediation_round?: number | null
          student_response: string
          submitted_at?: string | null
          thread_id?: string | null
          user_id?: string | null
        }
        Update: {
          exercise_variation_id?: string | null
          id?: string
          is_complete?: boolean | null
          is_remediation_attempt?: boolean | null
          needs_remediation?: boolean | null
          parent_attempt_id?: string | null
          remediation_round?: number | null
          student_response?: string
          submitted_at?: string | null
          thread_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_attempts_exercise_variation_id_fkey"
            columns: ["exercise_variation_id"]
            isOneToOne: false
            referencedRelation: "exercise_variations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_attempts_parent_attempt_id_fkey"
            columns: ["parent_attempt_id"]
            isOneToOne: false
            referencedRelation: "exercise_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_attempts_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_variations: {
        Row: {
          context_variation: string
          created_at: string | null
          difficulty_level: string
          exercise_id: string | null
          expected_steps: Json
          generated_hint: string
          generated_scenario: string
          id: string
          is_active: boolean | null
          thread_id: string | null
          user_id: string | null
          voice_personality: string | null
        }
        Insert: {
          context_variation: string
          created_at?: string | null
          difficulty_level: string
          exercise_id?: string | null
          expected_steps: Json
          generated_hint: string
          generated_scenario: string
          id?: string
          is_active?: boolean | null
          thread_id?: string | null
          user_id?: string | null
          voice_personality?: string | null
        }
        Update: {
          context_variation?: string
          created_at?: string | null
          difficulty_level?: string
          exercise_id?: string | null
          expected_steps?: Json
          generated_hint?: string
          generated_scenario?: string
          id?: string
          is_active?: boolean | null
          thread_id?: string | null
          user_id?: string | null
          voice_personality?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_variations_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_variations_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_variations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_variations_voice_personality_fkey"
            columns: ["voice_personality"]
            isOneToOne: false
            referencedRelation: "personalities"
            referencedColumns: ["name"]
          },
        ]
      }
      exercises: {
        Row: {
          base_context: string
          base_hint_template: string
          base_scenario_template: string
          base_title: string
          concept_id: string | null
          exercise_number: number
          expected_steps_by_difficulty: Json
          id: string
        }
        Insert: {
          base_context: string
          base_hint_template: string
          base_scenario_template: string
          base_title: string
          concept_id?: string | null
          exercise_number: number
          expected_steps_by_difficulty: Json
          id?: string
        }
        Update: {
          base_context?: string
          base_hint_template?: string
          base_scenario_template?: string
          base_title?: string
          concept_id?: string | null
          exercise_number?: number
          expected_steps_by_difficulty?: Json
          id?: string
        }
        Relationships: []
      }
      personalities: {
        Row: {
          approach_to_learning: string
          communication_style: string
          feedback_style: string
          id: string
          name: string
          personality_traits: string[]
          problem_solving_approach: string
          teaching_philosophy: string
        }
        Insert: {
          approach_to_learning: string
          communication_style: string
          feedback_style: string
          id?: string
          name: string
          personality_traits: string[]
          problem_solving_approach: string
          teaching_philosophy: string
        }
        Update: {
          approach_to_learning?: string
          communication_style?: string
          feedback_style?: string
          id?: string
          name?: string
          personality_traits?: string[]
          problem_solving_approach?: string
          teaching_philosophy?: string
        }
        Relationships: []
      }
      remediation_contexts: {
        Row: {
          common_mistake: string
          created_at: string | null
          how_it_fits: string
          id: string
          parent_attempt_id: string | null
          step_explanation: string
          target_step_id: string
          voice_personality: string | null
          why_it_matters: string
        }
        Insert: {
          common_mistake: string
          created_at?: string | null
          how_it_fits: string
          id?: string
          parent_attempt_id?: string | null
          step_explanation: string
          target_step_id: string
          voice_personality?: string | null
          why_it_matters: string
        }
        Update: {
          common_mistake?: string
          created_at?: string | null
          how_it_fits?: string
          id?: string
          parent_attempt_id?: string | null
          step_explanation?: string
          target_step_id?: string
          voice_personality?: string | null
          why_it_matters?: string
        }
        Relationships: [
          {
            foreignKeyName: "remediation_contexts_parent_attempt_id_fkey"
            columns: ["parent_attempt_id"]
            isOneToOne: false
            referencedRelation: "exercise_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "remediation_contexts_voice_personality_fkey"
            columns: ["voice_personality"]
            isOneToOne: false
            referencedRelation: "personalities"
            referencedColumns: ["name"]
          },
        ]
      }
      step_evaluations: {
        Row: {
          attempt_id: string | null
          id: string
          is_correct: boolean
          is_first_incorrect: boolean | null
          needs_remediation: boolean | null
          step_description: string
          step_id: string
          step_order: number
          student_articulation: string | null
          was_addressed: boolean
        }
        Insert: {
          attempt_id?: string | null
          id?: string
          is_correct: boolean
          is_first_incorrect?: boolean | null
          needs_remediation?: boolean | null
          step_description: string
          step_id: string
          step_order: number
          student_articulation?: string | null
          was_addressed: boolean
        }
        Update: {
          attempt_id?: string | null
          id?: string
          is_correct?: boolean
          is_first_incorrect?: boolean | null
          needs_remediation?: boolean | null
          step_description?: string
          step_id?: string
          step_order?: number
          student_articulation?: string | null
          was_addressed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "step_evaluations_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "exercise_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      threads: {
        Row: {
          completed_at: string | null
          concepts: Json
          concepts_completed: number | null
          created_at: string | null
          current_concept_id: string | null
          id: string
          primary_skill_focus: Json | null
          situation_description: string
          situation_title: string
          status: string | null
          title: string
          total_time_spent_seconds: number | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          concepts?: Json
          concepts_completed?: number | null
          created_at?: string | null
          current_concept_id?: string | null
          id?: string
          primary_skill_focus?: Json | null
          situation_description: string
          situation_title: string
          status?: string | null
          title: string
          total_time_spent_seconds?: number | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          concepts?: Json
          concepts_completed?: number | null
          created_at?: string | null
          current_concept_id?: string | null
          id?: string
          primary_skill_focus?: Json | null
          situation_description?: string
          situation_title?: string
          status?: string | null
          title?: string
          total_time_spent_seconds?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "threads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          default_difficulty_level: string | null
          email: string
          id: string
          name: string
          preferred_voice_personality: string | null
          primary_interest: string | null
        }
        Insert: {
          created_at?: string | null
          default_difficulty_level?: string | null
          email: string
          id?: string
          name: string
          preferred_voice_personality?: string | null
          primary_interest?: string | null
        }
        Update: {
          created_at?: string | null
          default_difficulty_level?: string | null
          email?: string
          id?: string
          name?: string
          preferred_voice_personality?: string | null
          primary_interest?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_personality"
            columns: ["preferred_voice_personality"]
            isOneToOne: false
            referencedRelation: "personalities"
            referencedColumns: ["name"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_exercise_completion: {
        Args: { attempt_id: string }
        Returns: boolean
      }
      evaluate_exercise_attempt: {
        Args: { attempt_id: string }
        Returns: {
          needs_remediation: boolean
          first_incorrect_step: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const 