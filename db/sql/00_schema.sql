CREATE TABLE "apply_locations" (
  "service_id" uuid,
  "application_lcoation" text,
  PRIMARY KEY ("service_id", "application_lcoation")
);

CREATE TABLE "apply_postal_address" (
  "service_id" uuid,
  "postal_address" text,
  PRIMARY KEY ("service_id", "postal_address")
);

CREATE TABLE "documents" (
  "service_id_id" uuid,
  "document_name" text,
  "document_url" text,
  PRIMARY KEY ("service_id_id", "document_name")
);

CREATE TABLE "related_system" (
  "subject_service_id" uuid,
  "object_service_id" uuid,
  "relationship" text,
  PRIMARY KEY ("subject_service_id", "object_service_id")
);

CREATE TABLE "shibuya" (
  "uri" text,
  "service_id" uuid PRIMARY KEY,
  "service_number" text,
  "origin_id" text,
  "alteration_flag" text,
  "provider" text,
  "provider_prefecture_id" text,
  "provider_city_id" text,
  "name" text,
  "content_abstract" text,
  "content_provisions" text,
  "content_target" text,
  "content_how_to_apply" text,
  "content_application_start_date" timestamp,
  "content_application_close_date" timestamp,
  "content_url" text,
  "content_contact" text,
  "content_information_release_date" timestamp,
  "tags" text,
  "theme" text,
  "tags_category" text,
  "tags_person_type" text,
  "tags_entity_type" text,
  "tags_keyword_type" text,
  "tags_issue_type" text,
  "tags_provider" text
);

CREATE TABLE "kumamoto" (
  "uri" text,
  "service_id" uuid PRIMARY KEY,
  "service_number" text,
  "origin_id" text,
  "alteration_flag" text,
  "provider" text,
  "provider_prefecture_id" text,
  "provider_city_id" text,
  "name" text,
  "content_abstract" text,
  "content_provisions" text,
  "content_target" text,
  "content_how_to_apply" text,
  "content_application_start_date" timestamp,
  "content_application_close_date" timestamp,
  "content_url" text,
  "content_contact" text,
  "content_information_release_date" timestamp,
  "tags" text,
  "theme" text,
  "tags_category" text,
  "tags_person_type" text,
  "tags_entity_type" text,
  "tags_keyword_type" text,
  "tags_issue_type" text,
  "tags_provider" text
);

CREATE TABLE "users" (
  "line_id" text,
  "created_at" timestamp
);

CREATE TABLE "results" (
  "result_id" text,
  "result_body" text,
  "line_id" text,
  "created_at" timestamp
);

ALTER TABLE "apply_locations" ADD FOREIGN KEY ("service_id") REFERENCES "shibuya" ("service_id");

ALTER TABLE "apply_postal_address" ADD FOREIGN KEY ("service_id") REFERENCES "shibuya" ("service_id");

ALTER TABLE "documents" ADD FOREIGN KEY ("service_id_id") REFERENCES "shibuya" ("service_id");

ALTER TABLE "related_system" ADD FOREIGN KEY ("subject_service_id") REFERENCES "shibuya" ("service_id");

ALTER TABLE "related_system" ADD FOREIGN KEY ("object_service_id") REFERENCES "shibuya" ("service_id");


ALTER TABLE "apply_locations" ADD FOREIGN KEY ("service_id") REFERENCES "kumamoto" ("service_id");

ALTER TABLE "apply_postal_address" ADD FOREIGN KEY ("service_id") REFERENCES "kumamoto" ("service_id");

ALTER TABLE "documents" ADD FOREIGN KEY ("service_id_id") REFERENCES "kumamoto" ("service_id");

ALTER TABLE "related_system" ADD FOREIGN KEY ("subject_service_id") REFERENCES "kumamoto" ("service_id");

ALTER TABLE "related_system" ADD FOREIGN KEY ("object_service_id") REFERENCES "kumamoto" ("service_id");
