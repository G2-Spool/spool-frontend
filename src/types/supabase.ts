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
      learning_threads: {
        Row: {
          completed_at: string | null
          completion_percentage: number | null
          complexity_score: number | null
          concepts_completed: number | null
          concepts_total: number | null
          created_at: string | null
          current_concept_id: string | null
          description: string | null
          endorsement_count: number | null
          estimated_completion_date: string | null
          estimated_concepts: number | null
          estimated_hours: number | null
          goal: string
          goal_confidence_score: number | null
          goal_extracted_at: string
          id: string
          is_shared: boolean | null
          last_accessed_at: string | null
          primary_subject: string
          remix_count: number | null
          share_code: string | null
          started_at: string | null
          status: string | null
          student_profile_id: string | null
          subjects_involved: string[]
          title: string
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          completed_at?: string | null
          completion_percentage?: number | null
          complexity_score?: number | null
          concepts_completed?: number | null
          concepts_total?: number | null
          created_at?: string | null
          current_concept_id?: string | null
          description?: string | null
          endorsement_count?: number | null
          estimated_completion_date?: string | null
          estimated_concepts?: number | null
          estimated_hours?: number | null
          goal: string
          goal_confidence_score?: number | null
          goal_extracted_at: string
          id?: string
          is_shared?: boolean | null
          last_accessed_at?: string | null
          primary_subject: string
          remix_count?: number | null
          share_code?: string | null
          started_at?: string | null
          status?: string | null
          student_profile_id?: string | null
          subjects_involved: string[]
          title: string
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          completed_at?: string | null
          completion_percentage?: number | null
          complexity_score?: number | null
          concepts_completed?: number | null
          concepts_total?: number | null
          created_at?: string | null
          current_concept_id?: string | null
          description?: string | null
          endorsement_count?: number | null
          estimated_completion_date?: string | null
          estimated_concepts?: number | null
          estimated_hours?: number | null
          goal?: string
          goal_confidence_score?: number | null
          goal_extracted_at?: string
          id?: string
          is_shared?: boolean | null
          last_accessed_at?: string | null
          primary_subject?: string
          remix_count?: number | null
          share_code?: string | null
          started_at?: string | null
          status?: string | null
          student_profile_id?: string | null
          subjects_involved?: string[]
          title?: string
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_threads_student_profile_id_fkey"
            columns: ["student_profile_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          active_threads_count: number | null
          age: number | null
          career_interests: string[] | null
          completed_threads_count: number | null
          created_at: string | null
          detailed_interests: Json | null
          first_name: string | null
          grade_level: string | null
          id: string
          interests: Json | null
          last_name: string | null
          philanthropic_interests: string[] | null
          thread_mastery_score: number | null
          thread_preferences: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          active_threads_count?: number | null
          age?: number | null
          career_interests?: string[] | null
          completed_threads_count?: number | null
          created_at?: string | null
          detailed_interests?: Json | null
          first_name?: string | null
          grade_level?: string | null
          id?: string
          interests?: Json | null
          last_name?: string | null
          philanthropic_interests?: string[] | null
          thread_mastery_score?: number | null
          thread_preferences?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          active_threads_count?: number | null
          age?: number | null
          career_interests?: string[] | null
          completed_threads_count?: number | null
          created_at?: string | null
          detailed_interests?: Json | null
          first_name?: string | null
          grade_level?: string | null
          id?: string
          interests?: Json | null
          last_name?: string | null
          philanthropic_interests?: string[] | null
          thread_mastery_score?: number | null
          thread_preferences?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_assessments: {
        Row: {
          application_ability: number | null
          assessment_type: string
          concept_id: string
          conceptual_understanding: number | null
          created_at: string | null
          cross_curricular_elements: Json | null
          cross_curricular_integration_score: number | null
          cross_subject_connections_made: Json | null
          enables_thread_branching: boolean | null
          evaluated_at: string | null
          exercise_prompt: string
          expected_steps: Json
          id: string
          integration_concepts: string[] | null
          overall_mastery_score: number | null
          qualifies_for_portfolio: boolean | null
          real_world_application_required: boolean | null
          requires_cross_subject_thinking: boolean | null
          response_demonstrates_goal_connection: boolean | null
          status: string | null
          step_evaluations: Json
          student_profile_id: string | null
          student_response: string
          submitted_at: string | null
          thread_goal_alignment_score: number | null
          thread_goal_integration: string
          thread_id: string | null
          thread_position_context: string | null
          unlocks_next_concepts: boolean | null
        }
        Insert: {
          application_ability?: number | null
          assessment_type: string
          concept_id: string
          conceptual_understanding?: number | null
          created_at?: string | null
          cross_curricular_elements?: Json | null
          cross_curricular_integration_score?: number | null
          cross_subject_connections_made?: Json | null
          enables_thread_branching?: boolean | null
          evaluated_at?: string | null
          exercise_prompt: string
          expected_steps: Json
          id?: string
          integration_concepts?: string[] | null
          overall_mastery_score?: number | null
          qualifies_for_portfolio?: boolean | null
          real_world_application_required?: boolean | null
          requires_cross_subject_thinking?: boolean | null
          response_demonstrates_goal_connection?: boolean | null
          status?: string | null
          step_evaluations: Json
          student_profile_id?: string | null
          student_response: string
          submitted_at?: string | null
          thread_goal_alignment_score?: number | null
          thread_goal_integration: string
          thread_id?: string | null
          thread_position_context?: string | null
          unlocks_next_concepts?: boolean | null
        }
        Update: {
          application_ability?: number | null
          assessment_type?: string
          concept_id?: string
          conceptual_understanding?: number | null
          created_at?: string | null
          cross_curricular_elements?: Json | null
          cross_curricular_integration_score?: number | null
          cross_subject_connections_made?: Json | null
          enables_thread_branching?: boolean | null
          evaluated_at?: string | null
          exercise_prompt?: string
          expected_steps?: Json
          id?: string
          integration_concepts?: string[] | null
          overall_mastery_score?: number | null
          qualifies_for_portfolio?: boolean | null
          real_world_application_required?: boolean | null
          requires_cross_subject_thinking?: boolean | null
          response_demonstrates_goal_connection?: boolean | null
          status?: string | null
          step_evaluations?: Json
          student_profile_id?: string | null
          student_response?: string
          submitted_at?: string | null
          thread_goal_alignment_score?: number | null
          thread_goal_integration?: string
          thread_id?: string | null
          thread_position_context?: string | null
          unlocks_next_concepts?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "thread_assessments_student_profile_id_fkey"
            columns: ["student_profile_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thread_assessments_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "learning_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_branches: {
        Row: {
          branch_created_at: string | null
          branch_reason: string
          branch_trigger_concept_id: string | null
          branch_type: string
          child_thread_id: string | null
          created_at: string | null
          divergence_point: number | null
          id: string
          is_active: boolean | null
          parent_thread_id: string | null
          shared_concepts_count: number | null
          unique_concepts_count: number | null
        }
        Insert: {
          branch_created_at?: string | null
          branch_reason: string
          branch_trigger_concept_id?: string | null
          branch_type: string
          child_thread_id?: string | null
          created_at?: string | null
          divergence_point?: number | null
          id?: string
          is_active?: boolean | null
          parent_thread_id?: string | null
          shared_concepts_count?: number | null
          unique_concepts_count?: number | null
        }
        Update: {
          branch_created_at?: string | null
          branch_reason?: string
          branch_trigger_concept_id?: string | null
          branch_type?: string
          child_thread_id?: string | null
          created_at?: string | null
          divergence_point?: number | null
          id?: string
          is_active?: boolean | null
          parent_thread_id?: string | null
          shared_concepts_count?: number | null
          unique_concepts_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "thread_branches_child_thread_id_fkey"
            columns: ["child_thread_id"]
            isOneToOne: false
            referencedRelation: "learning_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thread_branches_parent_thread_id_fkey"
            columns: ["parent_thread_id"]
            isOneToOne: false
            referencedRelation: "learning_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_collaborations: {
        Row: {
          can_invite_others: boolean | null
          can_modify_thread: boolean | null
          collaboration_type: string
          created_at: string | null
          current_participants: number | null
          id: string
          max_participants: number | null
          requires_approval: boolean | null
          status: string | null
          thread_id: string | null
          updated_at: string | null
        }
        Insert: {
          can_invite_others?: boolean | null
          can_modify_thread?: boolean | null
          collaboration_type: string
          created_at?: string | null
          current_participants?: number | null
          id?: string
          max_participants?: number | null
          requires_approval?: boolean | null
          status?: string | null
          thread_id?: string | null
          updated_at?: string | null
        }
        Update: {
          can_invite_others?: boolean | null
          can_modify_thread?: boolean | null
          collaboration_type?: string
          created_at?: string | null
          current_participants?: number | null
          id?: string
          max_participants?: number | null
          requires_approval?: boolean | null
          status?: string | null
          thread_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "thread_collaborations_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "learning_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_community: {
        Row: {
          category: string | null
          created_at: string | null
          difficulty_rating: string | null
          endorsement_count: number | null
          favorite_count: number | null
          id: string
          is_approved: boolean | null
          is_featured: boolean | null
          last_updated_at: string | null
          moderation_notes: string | null
          remix_count: number | null
          share_description: string | null
          share_title: string
          share_type: string
          shared_at: string | null
          shared_by_user_id: string | null
          tags: string[] | null
          thread_id: string | null
          view_count: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          difficulty_rating?: string | null
          endorsement_count?: number | null
          favorite_count?: number | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          last_updated_at?: string | null
          moderation_notes?: string | null
          remix_count?: number | null
          share_description?: string | null
          share_title: string
          share_type: string
          shared_at?: string | null
          shared_by_user_id?: string | null
          tags?: string[] | null
          thread_id?: string | null
          view_count?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          difficulty_rating?: string | null
          endorsement_count?: number | null
          favorite_count?: number | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          last_updated_at?: string | null
          moderation_notes?: string | null
          remix_count?: number | null
          share_description?: string | null
          share_title?: string
          share_type?: string
          shared_at?: string | null
          shared_by_user_id?: string | null
          tags?: string[] | null
          thread_id?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "thread_community_shared_by_user_id_fkey"
            columns: ["shared_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thread_community_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "learning_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_concepts: {
        Row: {
          attempts_count: number | null
          bridge_explanation: string | null
          bridge_from_concept_id: string | null
          bridge_strength: number | null
          completed_at: string | null
          concept_id: string
          concept_name: string
          created_at: string | null
          id: string
          is_core_concept: boolean | null
          mastery_level: number | null
          prerequisite_concept_ids: string[] | null
          relevance_explanation: string | null
          relevance_score: number
          sequence_order: number
          started_at: string | null
          status: string | null
          subject: string
          thread_id: string | null
          time_spent_seconds: number | null
          unlocked_at: string | null
          updated_at: string | null
        }
        Insert: {
          attempts_count?: number | null
          bridge_explanation?: string | null
          bridge_from_concept_id?: string | null
          bridge_strength?: number | null
          completed_at?: string | null
          concept_id: string
          concept_name: string
          created_at?: string | null
          id?: string
          is_core_concept?: boolean | null
          mastery_level?: number | null
          prerequisite_concept_ids?: string[] | null
          relevance_explanation?: string | null
          relevance_score: number
          sequence_order: number
          started_at?: string | null
          status?: string | null
          subject: string
          thread_id?: string | null
          time_spent_seconds?: number | null
          unlocked_at?: string | null
          updated_at?: string | null
        }
        Update: {
          attempts_count?: number | null
          bridge_explanation?: string | null
          bridge_from_concept_id?: string | null
          bridge_strength?: number | null
          completed_at?: string | null
          concept_id?: string
          concept_name?: string
          created_at?: string | null
          id?: string
          is_core_concept?: boolean | null
          mastery_level?: number | null
          prerequisite_concept_ids?: string[] | null
          relevance_explanation?: string | null
          relevance_score?: number
          sequence_order?: number
          started_at?: string | null
          status?: string | null
          subject?: string
          thread_id?: string | null
          time_spent_seconds?: number | null
          unlocked_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "thread_concepts_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "learning_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_participants: {
        Row: {
          collaboration_id: string
          individual_progress: Json | null
          joined_at: string | null
          left_at: string | null
          permissions: Json | null
          role: string
          shared_contributions: Json | null
          status: string | null
          user_id: string
        }
        Insert: {
          collaboration_id: string
          individual_progress?: Json | null
          joined_at?: string | null
          left_at?: string | null
          permissions?: Json | null
          role: string
          shared_contributions?: Json | null
          status?: string | null
          user_id: string
        }
        Update: {
          collaboration_id?: string
          individual_progress?: Json | null
          joined_at?: string | null
          left_at?: string | null
          permissions?: Json | null
          role?: string
          shared_contributions?: Json | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_participants_collaboration_id_fkey"
            columns: ["collaboration_id"]
            isOneToOne: false
            referencedRelation: "thread_collaborations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thread_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_portfolios: {
        Row: {
          concepts_demonstrated: string[]
          created_at: string | null
          creativity_score: number | null
          cross_curricular_connections: string | null
          educator_feedback: string | null
          id: string
          mastery_demonstration_score: number | null
          overall_score: number | null
          peer_reviews: Json | null
          project_description: string
          project_requirements: Json
          project_title: string
          project_type: string
          reviewed_at: string | null
          self_assessment: Json | null
          status: string | null
          student_profile_id: string | null
          subjects_integrated: string[]
          submission_files: Json | null
          submission_format: string | null
          submission_url: string | null
          submitted_at: string | null
          technical_execution_score: number | null
          thread_id: string | null
          updated_at: string | null
        }
        Insert: {
          concepts_demonstrated: string[]
          created_at?: string | null
          creativity_score?: number | null
          cross_curricular_connections?: string | null
          educator_feedback?: string | null
          id?: string
          mastery_demonstration_score?: number | null
          overall_score?: number | null
          peer_reviews?: Json | null
          project_description: string
          project_requirements: Json
          project_title: string
          project_type: string
          reviewed_at?: string | null
          self_assessment?: Json | null
          status?: string | null
          student_profile_id?: string | null
          subjects_integrated: string[]
          submission_files?: Json | null
          submission_format?: string | null
          submission_url?: string | null
          submitted_at?: string | null
          technical_execution_score?: number | null
          thread_id?: string | null
          updated_at?: string | null
        }
        Update: {
          concepts_demonstrated?: string[]
          created_at?: string | null
          creativity_score?: number | null
          cross_curricular_connections?: string | null
          educator_feedback?: string | null
          id?: string
          mastery_demonstration_score?: number | null
          overall_score?: number | null
          peer_reviews?: Json | null
          project_description?: string
          project_requirements?: Json
          project_title?: string
          project_type?: string
          reviewed_at?: string | null
          self_assessment?: Json | null
          status?: string | null
          student_profile_id?: string | null
          subjects_integrated?: string[]
          submission_files?: Json | null
          submission_format?: string | null
          submission_url?: string | null
          submitted_at?: string | null
          technical_execution_score?: number | null
          thread_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "thread_portfolios_student_profile_id_fkey"
            columns: ["student_profile_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thread_portfolios_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "learning_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_progress_snapshots: {
        Row: {
          active_time_minutes: number | null
          at_risk_indicators: Json | null
          average_mastery_score: number | null
          collaboration_events: number | null
          concepts_completed: number
          concepts_total: number
          created_at: string | null
          curiosity_events: number | null
          estimated_completion_date: string | null
          help_seeking_events: number | null
          id: string
          predicted_final_score: number | null
          session_count: number | null
          snapshot_date: string
          snapshot_type: string
          student_profile_id: string | null
          subjects_touched: string[]
          thread_id: string | null
          total_time_minutes: number | null
        }
        Insert: {
          active_time_minutes?: number | null
          at_risk_indicators?: Json | null
          average_mastery_score?: number | null
          collaboration_events?: number | null
          concepts_completed: number
          concepts_total: number
          created_at?: string | null
          curiosity_events?: number | null
          estimated_completion_date?: string | null
          help_seeking_events?: number | null
          id?: string
          predicted_final_score?: number | null
          session_count?: number | null
          snapshot_date: string
          snapshot_type: string
          student_profile_id?: string | null
          subjects_touched: string[]
          thread_id?: string | null
          total_time_minutes?: number | null
        }
        Update: {
          active_time_minutes?: number | null
          at_risk_indicators?: Json | null
          average_mastery_score?: number | null
          collaboration_events?: number | null
          concepts_completed?: number
          concepts_total?: number
          created_at?: string | null
          curiosity_events?: number | null
          estimated_completion_date?: string | null
          help_seeking_events?: number | null
          id?: string
          predicted_final_score?: number | null
          session_count?: number | null
          snapshot_date?: string
          snapshot_type?: string
          student_profile_id?: string | null
          subjects_touched?: string[]
          thread_id?: string | null
          total_time_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "thread_progress_snapshots_student_profile_id_fkey"
            columns: ["student_profile_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thread_progress_snapshots_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "learning_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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