CREATE TABLE "apply_locations" (
  "psid" uuid,
  "application_lcoation" text,
  PRIMARY KEY ("psid", "application_lcoation")
);

CREATE TABLE "apply_postal_address" (
  "psid" uuid,
  "postal_address" text,
  PRIMARY KEY ("psid", "postal_address")
);

CREATE TABLE "documents" (
  "psid_id" uuid,
  "document_name" text,
  "document_url" text,
  PRIMARY KEY ("psid_id", "document_name")
);

CREATE TABLE "related_system" (
  "subject_psid" uuid,
  "object_psid" uuid,
  "relationship" text,
  PRIMARY KEY ("subject_psid", "object_psid")
);

CREATE TABLE "shibuya" (
  "psid" uuid PRIMARY KEY,
  "service_number" text,
  "origin_id" text,
  "alteration_flag" text,
  "provider" text,
  "prefecture_id" text,
  "city_id" text,
  "name" text,
  "abstract" text,
  "provisions" text,
  "target" text,
  "how_to_apply" text,
  "application_start_date" text,
  "application_close_date" text,
  "url" text,
  "contact" text,
  "information_release_date" text,
  "tags" text,
  "theme" text,
  "category" text,
  "person_type" text,
  "entity_type" text,
  "keyword_type" text,
  "issue_type" text
);

CREATE TABLE "kumamoto" (
  "psid" uuid PRIMARY KEY,
  "management_id" text,
  "name" text,
  "target" text,
  "sub_title" text,
  "priority" text,
  "start_release_date" text,
  "end_release_date" text,
  "is_release" text,
  "overview" text,
  "organization" text,
  "parent_system" text,
  "relationship_parent_system" text,
  "qualification" text,
  "purpose" text,
  "area" text,
  "support_content" text,
  "note" text,
  "how_to_use" text,
  "needs" text,
  "documents_url" text,
  "postal_address" text,
  "acceptable_dates" text,
  "acceptable_times" text,
  "apply_url" text,
  "start_application_date" text,
  "end_application_date" text,
  "contact" text,
  "detail_url" text,
  "administrative_service_category" text,
  "lifestage_category" text,
  "problem_category" text
);

CREATE TABLE "shibuyakindergarten" (
  "psid" uuid PRIMARY KEY,
  "prefecture_id" text,
  "city_id" text,
  "area" text,
  "name" text,
  "target_age" text,
  "type_nursery_school" text,
  "administrator" text,
  "closed_days" text,
  "playground" text,
  "bringing_your_own_towel" text,
  "take_out_diapers" text,
  "parking" text,
  "lunch" text,
  "ibservation" text,
  "extended_hours_childcare" text,
  "allergy_friendly" text,
  "admission_available" text,
  "apply" text,
  "url" text,
  "contact" text,
  "information_release_date" text,
  "availability_of_childcare_facilities_for_0" text,
  "availability_of_childcare_facilities_for_1" text,
  "availability_of_childcare_facilities_for_2" text,
  "availability_of_childcare_facilities_for_3" text,
  "availability_of_childcare_facilities_for_4" text,
  "availability_of_childcare_facilities_for_5" text,
  "location" text
);

CREATE TABLE "users" (
  "line_id" text,
  "created_at" text
);

CREATE TABLE "results" (
  "result_id" text,
  "result_body" text,
  "line_id" text,
  "created_at" text
);

ALTER TABLE "apply_locations"
  ADD FOREIGN KEY ("psid") REFERENCES "shibuya" ("psid");

ALTER TABLE "apply_postal_address"
  ADD FOREIGN KEY ("psid") REFERENCES "shibuya" ("psid");

ALTER TABLE "documents"
  ADD FOREIGN KEY ("psid_id") REFERENCES "shibuya" ("psid");

ALTER TABLE "related_system"
  ADD FOREIGN KEY ("subject_psid") REFERENCES "shibuya" ("psid");

ALTER TABLE "related_system"
  ADD FOREIGN KEY ("object_psid") REFERENCES "shibuya" ("psid");

ALTER TABLE "apply_locations"
  ADD FOREIGN KEY ("psid") REFERENCES "kumamoto" ("psid");

ALTER TABLE "apply_postal_address"
  ADD FOREIGN KEY ("psid") REFERENCES "kumamoto" ("psid");

ALTER TABLE "documents"
  ADD FOREIGN KEY ("psid_id") REFERENCES "kumamoto" ("psid");

ALTER TABLE "related_system"
  ADD FOREIGN KEY ("subject_psid") REFERENCES "kumamoto" ("psid");

ALTER TABLE "related_system"
  ADD FOREIGN KEY ("object_psid") REFERENCES "kumamoto" ("psid");

ALTER TABLE "apply_locations"
  ADD FOREIGN KEY ("psid") REFERENCES "shibuyakindergarten" ("psid");

ALTER TABLE "apply_postal_address"
  ADD FOREIGN KEY ("psid") REFERENCES "shibuyakindergarten" ("psid");

ALTER TABLE "documents"
  ADD FOREIGN KEY ("psid_id") REFERENCES "shibuyakindergarten" ("psid");

ALTER TABLE "related_system"
  ADD FOREIGN KEY ("subject_psid") REFERENCES "shibuyakindergarten" ("psid");

ALTER TABLE "related_system"
  ADD FOREIGN KEY ("object_psid") REFERENCES "shibuyakindergarten" ("psid");

