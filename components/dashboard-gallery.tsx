"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Code2, LayoutDashboard } from "lucide-react"
import { ExternalLinkDialog, type ExternalLinkTarget } from "@/components/portfolio-nav"

type GalleryProject = {
  title: string
  type: string
  accent: string
  tabName: string
  code: string
  imageSrc: string
  imageAlt: string
  projectUrl?: string
}

const galleryProjects: GalleryProject[] = [
  {
    title: "Fluxo de Chamados",
    type: "Power BI / TI",
    accent: "#ff6b5d",
    tabName: "chamados",
    imageSrc: "/dashboards/fluxo-chamado-ti.png",
    imageAlt: "Dashboard de fluxo de chamados de Tecnologia da Informacao",
    projectUrl: "https://github.com/duguimaraes/power-bi-analytics-portfolio/tree/main/sla-ti-dashboard",
    code: `-- Project: IT SLA Dashboard
-- Description: SQL queries used for SLA analysis, runtime evaluation, and satisfaction metrics.

-- 1. Main Ticket Workflow Extraction
-- Description: Retrieves latest version of service requests and links workflow + assignment data.

SELECT 
    wf.process_id,
    req.requester_name,
    req.ticket_type,
    req.ticket_title,
    wf.workflow_status,
    req.business_unit,
    ISNULL(assignee.analyst_id, 'Waiting for Assignment') AS analyst_id,
    COALESCE(assignee.assignment_start_date, wf.process_start_date) AS start_date,
    assignee.assignment_end_date,
    assignee.total_runtime,
    req.priority,
    req.system_name,
    req.service_category,
    req.incident_category,
    req.incident_justification,
    req.is_project_related,
    req.waiting_for_third_party,
    req.corrective_reason,
    req.access_type,
    req.purchase_type,
    req.purchase_item,
    req.access_issue_type,
    req.unavailable_resource,
    req.installation_reason,
    req.maintenance_type,
    req.billing_impact,
    req.project_name
FROM service_requests req
INNER JOIN (
    SELECT 
        document_id, 
        MAX(version_number) AS latest_version
    FROM service_requests
    GROUP BY document_id
) latest_req 
    ON req.document_id = latest_req.document_id
   AND req.version_number = latest_req.latest_version
INNER JOIN workflow_processes wf
    ON wf.request_document_id = req.document_id
LEFT JOIN (
    SELECT 
        t.process_id,
        t.analyst_id,
        t.assignment_start_date,
        t.assignment_end_date,
        t.total_runtime
    FROM workflow_tasks t
    INNER JOIN (
        SELECT 
            process_id,
            MAX(task_sequence) AS latest_task_sequence
        FROM workflow_tasks
        WHERE analyst_id IN (
            'analyst_01',
            'analyst_02',
            'analyst_03',
            'analyst_04',
            'analyst_05'
        )
        AND analyst_id NOT IN ('system_auto')
        AND analyst_id NOT LIKE 'queue%'
        AND (
            task_notes IS NULL
            OR task_notes = ''
            OR task_notes NOT LIKE '%Task automatically assigned%'
        )
        GROUP BY process_id
    ) latest_task
        ON t.process_id = latest_task.process_id
       AND t.task_sequence = latest_task.latest_task_sequence
    WHERE t.analyst_id IN (
        'analyst_01',
        'analyst_02',
        'analyst_03',
        'analyst_04',
        'analyst_05'
    )
    AND t.analyst_id NOT IN ('system_auto')
    AND t.analyst_id NOT LIKE 'queue%'
    AND (
        t.task_notes IS NULL
        OR t.task_notes = ''
        OR t.task_notes NOT LIKE '%Task automatically assigned%'
    )
) assignee
    ON assignee.process_id = wf.process_id
WHERE wf.workflow_status IN ('Open', 'Completed');



-- 2. Runtime Analysis for IT Tickets
-- Description: Identifies tickets with high resolution time

SELECT
    t.process_id,
    t.analyst_id,
    t.total_runtime,
    wf.process_start_date
FROM workflow_tasks t
INNER JOIN workflow_processes wf
    ON wf.process_id = t.process_id
INNER JOIN service_requests req
    ON req.process_id = t.process_id
WHERE 
    t.analyst_id NOT IN ('system_auto')
    AND wf.process_type = 'IT_Request'
    AND t.analyst_id IN (
        'analyst_01',
        'analyst_02',
        'analyst_03',
        'analyst_04',
        'analyst_05'
    )
    AND t.analyst_id NOT LIKE 'queue%'
    AND wf.process_start_date >= '2025-01-01'
    AND wf.workflow_status = 'Completed'
    AND t.total_runtime >= 200
    AND req.waiting_for_third_party <> 'yes'
    AND req.is_project_related <> 'yes'
ORDER BY
    t.process_id,
    t.task_sequence;



-- 3. Closed Ticket Satisfaction Analysis
-- Description: Extracts satisfaction survey responses for completed IT tickets

SELECT
    req.process_id,
    req.requester_name,
    req.ticket_status,
    req.business_unit,
    req.ticket_type,
    req.analyst_service_rating,
    req.service_satisfaction,
    req.communication_clarity_rating,
    req.solution_effectiveness_rating,
    wf.workflow_status
FROM service_requests req
INNER JOIN (
    SELECT 
        document_id,
        MAX(version_number) AS latest_version
    FROM service_requests
    GROUP BY document_id
) latest_req
    ON req.document_id = latest_req.document_id
   AND req.version_number = latest_req.latest_version
INNER JOIN workflow_processes wf
    ON wf.request_document_id = req.document_id
WHERE wf.workflow_status = 'Completed'
  AND req.ticket_type IN ('Access', 'System', 'Infrastructure', 'Data')
  AND (
        req.analyst_service_rating <> 'Not Answered'
        OR req.service_satisfaction <> 'Not Answered'
      );`,
  },
  {
    title: "Pesagem Manual",
    type: "Power BI / Operations",
    accent: "#ff6b5d",
    tabName: "pesagem",
    imageSrc: "/dashboards/manual-weighing-dashboard.png",
    imageAlt: "Dashboard de controle de pesagem manual",
    projectUrl: "https://github.com/duguimaraes/power-bi-analytics-portfolio/tree/main/manual-weighing-dashboard",
    code: `-- Project: Manual Weighing Control Dashboard
-- Description: SQL queries used to monitor manual truck weighing operations,
-- including approval flow, operational delays, and recurring manual weighing scenarios.

-- 1. Manual Weighing Records (With Integration Filters)

SELECT
    w.load_number,
    CASE w.direction_type
        WHEN 'OUT' THEN 'Outbound'
        WHEN 'IN' THEN 'Inbound'
        ELSE 'Not Informed'
    END AS direction,
    w.is_first_weighing_manual,
    w.is_second_weighing_manual,
    p.product_name,
    approval.approver_name,
    approval.manual_reason,
    b.business_unit_name,
    CONVERT(DATE, DATEADD(HOUR, -1,
        CASE
            WHEN w.is_second_weighing_manual = '1' THEN w.second_weighing_datetime
            ELSE w.first_weighing_datetime
        END AT TIME ZONE 'UTC' AT TIME ZONE 'E. South America Standard Time'
    )) AS weighing_date,
    CONVERT(TIME, DATEADD(HOUR, -1,
        CASE
            WHEN w.is_second_weighing_manual = '1' THEN w.second_weighing_datetime
            ELSE w.first_weighing_datetime
        END AT TIME ZONE 'UTC' AT TIME ZONE 'E. South America Standard Time'
    )) AS weighing_time,
    CONVERT(DATE, DATEADD(HOUR, -1,
        CASE
            WHEN w.is_second_weighing_manual = '1' THEN w.second_approval_datetime
            ELSE w.first_approval_datetime
        END AT TIME ZONE 'UTC' AT TIME ZONE 'E. South America Standard Time'
    )) AS approval_date,
    CONVERT(TIME, DATEADD(HOUR, -1,
        CASE
            WHEN w.is_second_weighing_manual = '1' THEN w.second_approval_datetime
            ELSE w.first_approval_datetime
        END AT TIME ZONE 'UTC' AT TIME ZONE 'E. South America Standard Time'
    )) AS approval_time,
    DATEDIFF(MINUTE,
        DATEADD(HOUR, -1,
            CASE
                WHEN w.is_second_weighing_manual = '1' THEN w.second_weighing_datetime
                ELSE w.first_weighing_datetime
            END AT TIME ZONE 'UTC' AT TIME ZONE 'E. South America Standard Time'
        ),
        DATEADD(HOUR, -1,
            CASE
                WHEN w.is_second_weighing_manual = '1' THEN w.second_approval_datetime
                ELSE w.first_approval_datetime
            END AT TIME ZONE 'UTC' AT TIME ZONE 'E. South America Standard Time'
        )
    ) AS approval_time_minutes
FROM truck_weighing w
LEFT JOIN business_units b ON b.business_unit_id = w.business_unit_id
LEFT JOIN users u1 ON u1.user_id = w.first_approval_user_id
LEFT JOIN users u2 ON u2.user_id = w.second_approval_user_id
LEFT JOIN products p ON p.product_id = w.product_id
OUTER APPLY (
    SELECT u1.user_name AS approver_name, w.first_manual_reason AS manual_reason
    WHERE w.first_approval_user_id IS NOT NULL

    UNION ALL

    SELECT u2.user_name AS approver_name, w.second_manual_reason AS manual_reason
    WHERE w.second_approval_user_id IS NOT NULL
) approval
WHERE '1' IN (w.is_first_weighing_manual, w.is_second_weighing_manual)
  AND w.deleted_at IS NULL
  AND w.status_code = 'COMPLETED'
  AND w.erp_document IS NOT NULL
  AND (
        w.first_approval_user_id IS NOT NULL
        OR w.second_approval_user_id IS NOT NULL
      )

-- 2. Manual Weighing Records (Without Integration Filters)

SELECT
    w.load_number,
    CASE w.direction_type
        WHEN 'OUT' THEN 'Outbound'
        WHEN 'IN' THEN 'Inbound'
        ELSE 'Not Informed'
    END AS direction,
    w.is_first_weighing_manual,
    w.is_second_weighing_manual,
    p.product_name,
    approval.approver_name,
    approval.manual_reason,
    b.business_unit_name,
    CONVERT(DATE, DATEADD(HOUR, -1,
        CASE
            WHEN w.is_second_weighing_manual = '1' THEN w.second_weighing_datetime
            ELSE w.first_weighing_datetime
        END AT TIME ZONE 'UTC' AT TIME ZONE 'E. South America Standard Time'
    )) AS weighing_date,
    CONVERT(TIME, DATEADD(HOUR, -1,
        CASE
            WHEN w.is_second_weighing_manual = '1' THEN w.second_weighing_datetime
            ELSE w.first_weighing_datetime
        END AT TIME ZONE 'UTC' AT TIME ZONE 'E. South America Standard Time'
    )) AS weighing_time,
    CONVERT(DATE, DATEADD(HOUR, -1,
        CASE
            WHEN w.is_second_weighing_manual = '1' THEN w.second_approval_datetime
            ELSE w.first_approval_datetime
        END AT TIME ZONE 'UTC' AT TIME ZONE 'E. South America Standard Time'
    )) AS approval_date,
    CONVERT(TIME, DATEADD(HOUR, -1,
        CASE
            WHEN w.is_second_weighing_manual = '1' THEN w.second_approval_datetime
            ELSE w.first_approval_datetime
        END AT TIME ZONE 'UTC' AT TIME ZONE 'E. South America Standard Time'
    )) AS approval_time,
    DATEDIFF(MINUTE,
        DATEADD(HOUR, -1,
            CASE
                WHEN w.is_second_weighing_manual = '1' THEN w.second_weighing_datetime
                ELSE w.first_weighing_datetime
            END AT TIME ZONE 'UTC' AT TIME ZONE 'E. South America Standard Time'
        ),
        DATEADD(HOUR, -1,
            CASE
                WHEN w.is_second_weighing_manual = '1' THEN w.second_approval_datetime
                ELSE w.first_approval_datetime
            END AT TIME ZONE 'UTC' AT TIME ZONE 'E. South America Standard Time'
        )
    ) AS approval_time_minutes
FROM truck_weighing w
LEFT JOIN business_units b ON b.business_unit_id = w.business_unit_id
LEFT JOIN users u1 ON u1.user_id = w.first_approval_user_id
LEFT JOIN users u2 ON u2.user_id = w.second_approval_user_id
LEFT JOIN products p ON p.product_id = w.product_id
OUTER APPLY (
    SELECT u1.user_name AS approver_name, w.first_manual_reason AS manual_reason
    WHERE w.first_approval_user_id IS NOT NULL

    UNION ALL

    SELECT u2.user_name AS approver_name, w.second_manual_reason AS manual_reason
    WHERE w.second_approval_user_id IS NOT NULL
) approval
WHERE '1' IN (w.is_first_weighing_manual, w.is_second_weighing_manual)
  AND w.deleted_at IS NULL
  AND w.status_code = 'COMPLETED'
  AND (
        w.first_approval_user_id IS NOT NULL
        OR w.second_approval_user_id IS NOT NULL
      )

-- 3. Manual Weighing Operational Details

SELECT
    w.load_number,
    CASE w.direction_type
        WHEN 'OUT' THEN 'Outbound'
        WHEN 'IN' THEN 'Inbound'
        ELSE 'Not Informed'
    END AS direction,
    unified.operator_name,
    unified.product_name,
    w.is_first_weighing_manual AS first_weighing_manual,
    w.is_second_weighing_manual AS second_weighing_manual,
    unified.business_unit_name,
    CONVERT(DATE, DATEADD(HOUR, -1,
        w.first_weighing_datetime AT TIME ZONE 'UTC' AT TIME ZONE 'E. South America Standard Time'
    )) AS first_weighing_date,
    CONVERT(TIME, DATEADD(HOUR, -1,
        w.first_weighing_datetime AT TIME ZONE 'UTC' AT TIME ZONE 'E. South America Standard Time'
    )) AS first_weighing_time,
    CONVERT(DATE, DATEADD(HOUR, -1,
        w.second_weighing_datetime AT TIME ZONE 'UTC' AT TIME ZONE 'E. South America Standard Time'
    )) AS second_weighing_date,
    CONVERT(TIME, DATEADD(HOUR, -1,
        w.second_weighing_datetime AT TIME ZONE 'UTC' AT TIME ZONE 'E. South America Standard Time'
    )) AS second_weighing_time
FROM truck_weighing w
LEFT JOIN business_units b ON b.business_unit_id = w.business_unit_id
LEFT JOIN users u1 ON u1.user_id = w.first_weighing_user_id
LEFT JOIN users u2 ON u2.user_id = w.second_weighing_user_id
LEFT JOIN products p ON p.product_id = w.product_id
OUTER APPLY (
    SELECT u1.user_name AS operator_name, b.business_unit_name, p.product_name
    WHERE w.first_weighing_user_id IS NOT NULL
      AND w.first_weighing_user_id <> w.second_weighing_user_id

    UNION ALL

    SELECT u2.user_name AS operator_name, NULL, NULL
    WHERE w.second_weighing_user_id IS NOT NULL
      AND w.first_weighing_user_id <> w.second_weighing_user_id

    UNION ALL

    SELECT u2.user_name AS operator_name, b.business_unit_name, p.product_name
    WHERE w.second_weighing_user_id IS NOT NULL
      AND (
            w.first_weighing_user_id = w.second_weighing_user_id
            OR w.first_weighing_user_id IS NULL
          )
) unified
WHERE w.deleted_at IS NULL
  AND w.status_code = 'COMPLETED'
ORDER BY w.first_weighing_datetime DESC;`,
  },
  {
    title: "Boletins Operacionais",
    type: "Power BI / Operations",
    accent: "#b78cff",
    tabName: "boletins",
    imageSrc: "/dashboards/gallery/img3.png",
    imageAlt: "Dashboard de controle de boletins operacionais",
    projectUrl: "https://github.com/duguimaraes/power-bi-analytics-portfolio/tree/main/sap-bulletin-reversal-dashboard",
    code: `-- Project: Operational Bulletin Control Dashboard
-- Description: Consolidates operational bulletin records across multiple
-- business units, standardizing bulletin types and document information.

SELECT
    'Business Unit A' AS source_unit,
    d.document_number,
    d.document_date,
    d.bulletin_number,
    d.branch_name,
    CASE d.bulletin_origin
        WHEN 'F' THEN 'Fuel'
        WHEN 'L' THEN 'Lubrication'
        WHEN 'S' THEN 'Supply'
        WHEN 'P' THEN 'Planting'
        WHEN 'T' THEN 'Seed Treatment'
        ELSE 'Not Defined'
    END AS bulletin_type
FROM business_unit_a.goods_receipts d
WHERE d.bulletin_origin IN ('F', 'L', 'S', 'P', 'T')

UNION ALL

SELECT
    'Business Unit B' AS source_unit,
    d.document_number,
    d.document_date,
    d.bulletin_number,
    'Unit B' AS branch_name,
    CASE d.bulletin_origin
        WHEN 'F' THEN 'Fuel'
        WHEN 'L' THEN 'Lubrication'
        WHEN 'S' THEN 'Supply'
        WHEN 'P' THEN 'Planting'
        WHEN 'T' THEN 'Seed Treatment'
        ELSE 'Not Defined'
    END AS bulletin_type
FROM business_unit_b.goods_receipts d
WHERE d.bulletin_origin IN ('F', 'L', 'S', 'P', 'T')

UNION ALL

SELECT
    'Business Unit C' AS source_unit,
    d.document_number,
    d.document_date,
    d.bulletin_number,
    d.branch_name,
    CASE d.bulletin_origin
        WHEN 'F' THEN 'Fuel'
        WHEN 'L' THEN 'Lubrication'
        WHEN 'S' THEN 'Supply'
        WHEN 'P' THEN 'Planting'
        WHEN 'T' THEN 'Seed Treatment'
        ELSE 'Not Defined'
    END AS bulletin_type
FROM business_unit_c.goods_receipts d
WHERE d.bulletin_origin IN ('F', 'L', 'S', 'P', 'T')

UNION ALL

SELECT
    'Business Unit D' AS source_unit,
    d.document_number,
    d.document_date,
    d.bulletin_number,
    'Unit D' AS branch_name,
    CASE d.bulletin_origin
        WHEN 'F' THEN 'Fuel'
        WHEN 'L' THEN 'Lubrication'
        WHEN 'S' THEN 'Supply'
        WHEN 'P' THEN 'Planting'
        WHEN 'T' THEN 'Seed Treatment'
        ELSE 'Not Defined'
    END AS bulletin_type
FROM business_unit_d.goods_receipts d
WHERE d.bulletin_origin IN ('F', 'L', 'S', 'P', 'T');`,
  },
  {
    title: "Custos de Energia",
    type: "Power BI / Finance",
    accent: "#6cb5ff",
    tabName: "energia",
    imageSrc: "/dashboards/gallery/img4.png",
    imageAlt: "Dashboard de custos de energia",
    code: `-- Dashboard: Energy Costs
SELECT
  business_unit,
  reference_month,
  SUM(consumption_kwh) AS consumption_kwh,
  SUM(invoice_amount) AS total_cost
FROM energy_costs
GROUP BY business_unit, reference_month;`,
  },
  {
    title: "Controle de Estoque",
    type: "Power BI / Inventory",
    accent: "#6cb5ff",
    tabName: "estoque",
    imageSrc: "/dashboards/gallery/img5.png",
    imageAlt: "Dashboard de controle de estoque e obsolescencia",
    projectUrl: "https://github.com/duguimaraes/power-bi-analytics-portfolio/tree/main/inventory-control-dashboard",
    code: `-- Project: Inventory Movement & Obsolescence Dashboard
-- Description: Consolidates inventory movement data across multiple business units, calculates monthly stock activity, and identifies inactive / obsolete items.

WITH unified_inventory_data AS (
    -- Business Unit A
    SELECT 
        inv.location_code,
        inv.item_code,
        inv.document_date,
        inv.in_quantity,
        inv.out_quantity,
        inv.stock_value,
        itm.item_name,
        itm.item_group_code,
        wh.min_stock_level,
        wh.max_stock_level,
        grp.item_group_name
    FROM business_unit_a.inventory_log inv
    LEFT JOIN business_unit_a.items itm
        ON itm.item_code = inv.item_code
    LEFT JOIN business_unit_a.item_warehouse wh
        ON wh.item_code = inv.item_code
       AND wh.warehouse_code = inv.location_code
    LEFT JOIN business_unit_a.item_groups grp
        ON grp.item_group_code = itm.item_group_code

    UNION ALL

    -- Business Unit B
    SELECT 
        inv.location_code,
        inv.item_code,
        inv.document_date,
        inv.in_quantity,
        inv.out_quantity,
        inv.stock_value,
        itm.item_name,
        itm.item_group_code,
        wh.min_stock_level,
        wh.max_stock_level,
        grp.item_group_name
    FROM business_unit_b.inventory_log inv
    LEFT JOIN business_unit_b.items itm
        ON itm.item_code = inv.item_code
    LEFT JOIN business_unit_b.item_warehouse wh
        ON wh.item_code = inv.item_code
       AND wh.warehouse_code = inv.location_code
    LEFT JOIN business_unit_b.item_groups grp
        ON grp.item_group_code = itm.item_group_code

    UNION ALL

    -- Business Unit C
    SELECT 
        inv.location_code,
        inv.item_code,
        inv.document_date,
        inv.in_quantity,
        inv.out_quantity,
        inv.stock_value,
        itm.item_name,
        itm.item_group_code,
        wh.min_stock_level,
        wh.max_stock_level,
        grp.item_group_name
    FROM business_unit_c.inventory_log inv
    LEFT JOIN business_unit_c.items itm
        ON itm.item_code = inv.item_code
    LEFT JOIN business_unit_c.item_warehouse wh
        ON wh.item_code = inv.item_code
       AND wh.warehouse_code = inv.location_code
    LEFT JOIN business_unit_c.item_groups grp
        ON grp.item_group_code = itm.item_group_code

    UNION ALL

    -- Business Unit D
    SELECT 
        inv.location_code,
        inv.item_code,
        inv.document_date,
        inv.in_quantity,
        inv.out_quantity,
        inv.stock_value,
        itm.item_name,
        itm.item_group_code,
        wh.min_stock_level,
        wh.max_stock_level,
        grp.item_group_name
    FROM business_unit_d.inventory_log inv
    LEFT JOIN business_unit_d.items itm
        ON itm.item_code = inv.item_code
    LEFT JOIN business_unit_d.item_warehouse wh
        ON wh.item_code = inv.item_code
       AND wh.warehouse_code = inv.location_code
    LEFT JOIN business_unit_d.item_groups grp
        ON grp.item_group_code = itm.item_group_code
),

monthly_inventory_movement AS (
    SELECT 
        u.location_code,
        u.item_code,
        u.item_name,
        u.item_group_code,
        u.item_group_name,
        u.min_stock_level,
        u.max_stock_level,
        LAST_DAY_OF_MONTH(CAST(u.document_date AS TIMESTAMP)) AS reference_month,
        SUM(CAST(u.in_quantity AS DECIMAL(18,2))) AS total_inbound,
        SUM(CAST(u.out_quantity AS DECIMAL(18,2))) AS total_outbound,
        SUM(CAST(u.stock_value AS DECIMAL(18,2))) AS total_stock_value
    FROM unified_inventory_data u
    GROUP BY 
        u.location_code,
        u.item_code,
        u.item_name,
        u.item_group_code,
        u.item_group_name,
        u.min_stock_level,
        u.max_stock_level,
        LAST_DAY_OF_MONTH(CAST(u.document_date AS TIMESTAMP))
),

latest_inventory_movement AS (
    SELECT 
        item_code,
        location_code,
        MAX(
            CASE 
                WHEN CAST(in_quantity AS DECIMAL(18,2)) > 0 
                THEN CAST(document_date AS TIMESTAMP)
            END
        ) AS last_inbound_date,
        MAX(
            CASE 
                WHEN CAST(out_quantity AS DECIMAL(18,2)) > 0 
                THEN CAST(document_date AS TIMESTAMP)
            END
        ) AS last_outbound_date
    FROM unified_inventory_data
    GROUP BY item_code, location_code
)

SELECT
    CASE 
        WHEN m.location_code LIKE '12%' THEN 'Farm A'
        WHEN m.location_code LIKE '13%' THEN 'Farm B'
        WHEN m.location_code LIKE '14%' THEN 'Farm C'
        WHEN m.location_code LIKE '15%' THEN 'Farm D'
        WHEN m.location_code LIKE '16%' THEN 'Farm E'
        WHEN m.location_code LIKE '17%' THEN 'Farm F'
        WHEN m.location_code LIKE '18%' THEN 'Farm G'
        WHEN m.location_code LIKE '51%' THEN 'Livestock Unit A'
        WHEN m.location_code LIKE '52%' THEN 'Livestock Unit B'
        WHEN m.location_code LIKE '53%' THEN 'Livestock Unit C'
        ELSE 'Other Unit'
    END AS business_unit,
    m.item_code,
    m.item_name,
    m.location_code AS warehouse_code,
    m.total_inbound AS inbound_quantity,
    m.total_outbound AS outbound_quantity,
    m.total_inbound - m.total_outbound AS inventory_balance,
    m.total_stock_value,
    m.item_group_name,
    m.item_group_code,
    CAST(REPLACE(m.min_stock_level, '.', '') AS DECIMAL(18,2)) AS min_stock_level,
    CAST(REPLACE(m.max_stock_level, '.', '') AS DECIMAL(18,2)) AS max_stock_level,
    m.reference_month,
    lm.last_inbound_date,
    lm.last_outbound_date,
    CASE 
        WHEN lm.last_outbound_date IS NOT NULL
         AND lm.last_inbound_date IS NOT NULL
        THEN date_diff('day', lm.last_inbound_date, lm.last_outbound_date)
        ELSE NULL
    END AS days_until_outbound,
    CASE 
        WHEN lm.last_outbound_date IS NULL
          OR lm.last_inbound_date > lm.last_outbound_date
        THEN date_diff('day', lm.last_inbound_date, CURRENT_DATE)
        ELSE NULL
    END AS days_without_movement
FROM monthly_inventory_movement m
LEFT JOIN latest_inventory_movement lm
    ON lm.item_code = m.item_code
   AND lm.location_code = m.location_code;`,
  },
  {
    title: "Despesas de Viagem",
    type: "Power BI / Finance",
    accent: "#d6ef38",
    tabName: "viagens",
    imageSrc: "/dashboards/gallery/img6.png",
    imageAlt: "Dashboard de adiantamentos e despesas de viagem",
    projectUrl: "https://github.com/duguimaraes/power-bi-analytics-portfolio/tree/main/travel-advance-expense-workflow-dashboard",
    code: `-- Project: Travel Advance & Expense Workflow Dashboard
-- Description: Unified query combining travel request data with workflow status, current activity, and responsible user.

WITH latest_requests AS (
    SELECT
        r.request_id,
        r.document_id,
        r.version_number,
        r.request_date,
        r.request_number,
        r.requester_name,
        r.requester_document,
        r.business_unit,
        r.department,
        r.travel_start_date,
        r.travel_end_date,
        r.total_travel_days,
        r.request_type,
        r.advance_amount,
        r.bank_name,
        r.bank_branch,
        r.bank_account,
        r.advance_justification,
        r.advance_period_start,
        r.advance_period_end,
        r.amount_difference,
        r.travel_occurrences,
        r.decision_status,
        r.decision_flag,
        r.debtor_role,
        r.origin_city,
        r.destination_city,
        r.advance_reason,
        r.travel_reason,
        wf.process_number,
        wf.workflow_status,
        wf.requester_employee_id
    FROM travel_requests r
    INNER JOIN (
        SELECT
            document_id,
            MAX(version_number) AS latest_version
        FROM travel_requests
        GROUP BY document_id
    ) latest
        ON r.document_id = latest.document_id
       AND r.version_number = latest.latest_version
    INNER JOIN workflow_processes wf
        ON wf.request_document_id = r.document_id
    WHERE r.request_type IN ('Advance', 'Expense Report')
      AND r.request_number NOT IN ('REQUEST_EXCLUDED')
      AND wf.workflow_status IN ('Open', 'Completed')
),

current_workflow AS (
    SELECT
        wf.process_number,
        req.requester_full_name,
        ISNULL(resp.user_full_name, 'Task Stopped in Group Queue') AS current_responsible,
        CASE previous_steps.selected_step_code
            WHEN '115' THEN 'Advance Approval'
            WHEN '121' THEN 'Advance Rejected'
            WHEN '119' THEN 'Purchase Request'
            WHEN '133' THEN 'Invoices and Accounts Payable'
            WHEN '130' THEN 'Missing Information'
            WHEN '137' THEN 'Missing Information'
            WHEN '141' THEN 'Expense Report'
            WHEN '143' THEN 'Expense Report Approval'
            WHEN '148' THEN 'Request Adjustment'
            WHEN '154' THEN 'Invoices and Accounts Payable'
            WHEN '151' THEN 'Missing Information'
            WHEN '158' THEN 'Missing Information'
            WHEN '180' THEN 'Payroll Deduction'
            WHEN '163' THEN 'Value Return'
            WHEN '165' THEN 'Return Validation'
            WHEN '92'  THEN 'Missing Information'
            WHEN '90'  THEN 'Missing Information'
            WHEN '44'  THEN 'Expense Report'
            WHEN '7'   THEN 'Expense Report'
            WHEN '19'  THEN 'Expense Report'
            WHEN '46'  THEN 'Expense Report Approval'
            WHEN '48'  THEN 'Purchase Request'
            WHEN '68'  THEN 'Invoices and Accounts Payable'
            WHEN '11'  THEN 'Missing Receipts'
            WHEN '102' THEN 'Invoices and Accounts Payable'
            WHEN '93'  THEN 'Invoices and Accounts Payable'
            WHEN '25'  THEN 'Invoices and Accounts Payable'
            WHEN '106' THEN 'Reimbursement Validation'
            WHEN '17'  THEN 'Expense Report'
            WHEN '135' THEN 'Expense Report'
            WHEN '111' THEN 'Reimbursement Validation'
            WHEN '117' THEN 'Purchase Request'
            WHEN '27'  THEN 'Value Return'
            WHEN '21'  THEN 'Request Adjustment'
            WHEN '156' THEN 'Value Return'
            WHEN '167' THEN 'Value Return'
            WHEN '150' THEN 'Request Adjustment'
            WHEN '152' THEN 'Missing Information'
            WHEN '145' THEN 'Request Adjustment'
            WHEN '95'  THEN 'Purchase Request'
            WHEN '98'  THEN 'Invoices and Accounts Payable'
            ELSE CONVERT(VARCHAR, previous_steps.selected_step_code)
        END AS current_activity,
        FORMAT(CAST(task.assignment_start_date AS DATETIME2), 'dd/MM/yyyy HH:mm') AS responsible_since,
        task.assignment_start_date
    FROM (
        SELECT *
        FROM workflow_tasks
        WHERE assigned_user_id <> 'system_auto'
    ) task
    OUTER APPLY (
        SELECT selected_step_code
        FROM (
            SELECT
                selected_step_code,
                ROW_NUMBER() OVER (
                    PARTITION BY process_number
                    ORDER BY task_sequence DESC
                ) AS row_num
            FROM workflow_tasks
            WHERE process_number = task.process_number
              AND selected_step_code IS NOT NULL
        ) step_history
        WHERE step_history.row_num = 2
    ) previous_steps
    INNER JOIN workflow_processes wf
        ON wf.process_number = task.process_number
    LEFT JOIN (
        SELECT
            ut.user_code AS employee_id,
            u.full_name AS user_full_name
        FROM user_tenant ut
        INNER JOIN system_users u
            ON ut.user_id = u.user_id
    ) resp
        ON resp.employee_id = task.assigned_user_id
    LEFT JOIN (
        SELECT
            ut.user_code AS employee_id,
            u.full_name AS requester_full_name
        FROM user_tenant ut
        INNER JOIN system_users u
            ON ut.user_id = u.user_id
    ) req
        ON req.employee_id = wf.requester_employee_id
    WHERE task.is_active_log = 1
      AND wf.workflow_status IN ('Open', 'Completed')
)

SELECT
    lr.request_id,
    lr.document_id,
    lr.version_number,
    lr.process_number,
    lr.request_date,
    lr.request_number,
    COALESCE(cw.requester_full_name, lr.requester_name) AS requester_name,
    lr.requester_document,
    lr.business_unit,
    lr.department,
    lr.travel_start_date,
    lr.travel_end_date,
    lr.total_travel_days,
    lr.request_type,
    lr.advance_amount,
    lr.bank_name,
    lr.bank_branch,
    lr.bank_account,
    lr.advance_justification,
    lr.advance_period_start,
    lr.advance_period_end,
    lr.amount_difference,
    lr.travel_occurrences,
    lr.decision_status,
    lr.decision_flag,
    lr.debtor_role,
    lr.origin_city,
    lr.destination_city,
    lr.advance_reason,
    lr.travel_reason,
    lr.workflow_status,
    cw.current_responsible,
    cw.current_activity,
    cw.responsible_since,
    cw.assignment_start_date
FROM latest_requests lr
LEFT JOIN current_workflow cw
    ON cw.process_number = lr.process_number
ORDER BY lr.request_date DESC, lr.request_number DESC;`,
  },
  {
    title: "Paradas Operacionais",
    type: "Power BI / Operations",
    accent: "#76d672",
    tabName: "paradas",
    imageSrc: "/dashboards/gallery/img7.png",
    imageAlt: "Dashboard de paradas operacionais Busa",
    projectUrl: "https://github.com/duguimaraes/power-bi-analytics-portfolio/tree/main/busa-operational-downtime-dashboard",
    code: `-- Project: Busa Operational Downtime Dashboard
-- Description: Extracts downtime events with duration, component, cause and operational context for industrial equipment.

SELECT 
  s.session_number,
  s.status,
  s.shift,
  d.downtime_number,
  
  date_format(from_iso8601_timestamp(d.start_datetime), '%d/%m/%Y %H:%i:%s') AS start_datetime,
  date_format(from_iso8601_timestamp(d.end_datetime),   '%d/%m/%Y %H:%i:%s') AS end_datetime,
  
  mt.motive_name      AS motive,
  ct.component_name   AS component,
  cs.cause_name       AS cause,
  bu.business_unit    AS facility,
  se.season_code      AS season,
  
  COALESCE(d.downtime_percentage, 0) AS downtime_percentage,

  -- total downtime (minutes)
  CAST(
    date_diff(
      'second',
      from_iso8601_timestamp(d.start_datetime) AT TIME ZONE 'America/Cuiaba',
      from_iso8601_timestamp(d.end_datetime)   AT TIME ZONE 'America/Cuiaba'
    ) AS double
  ) / 60.0 AS total_minutes,

  -- effective downtime (applies %)
  CAST(
    (
      CAST(
        date_diff(
          'second',
          from_iso8601_timestamp(d.start_datetime) AT TIME ZONE 'America/Cuiaba',
          from_iso8601_timestamp(d.end_datetime)   AT TIME ZONE 'America/Cuiaba'
        ) AS double
      ) / 60.0
    ) * (COALESCE(d.downtime_percentage, 0) / 100.0)
    AS DECIMAL(18,2)
  ) AS effective_downtime_minutes,

  '1439' AS session_duration_minutes
  
FROM industrial_process.downtime d

INNER JOIN industrial_process.downtime_motive       dm ON d.downtime_motive_id     = dm.downtime_motive_id
INNER JOIN industrial_process.motive_type           mt ON dm.motive_type_id        = mt.motive_type_id

INNER JOIN industrial_process.downtime_component    dc ON d.downtime_component_id  = dc.downtime_component_id
INNER JOIN industrial_process.component_type        ct ON dc.component_type_id     = ct.component_type_id

INNER JOIN industrial_process.downtime_cause        dcs ON d.downtime_cause_id     = dcs.downtime_cause_id
INNER JOIN industrial_process.cause_type            cs ON dcs.cause_type_id        = cs.cause_type_id

INNER JOIN industrial_process.session               s ON d.session_id              = s.session_id
INNER JOIN industrial_process.business_unit         bu ON s.business_unit_id       = bu.business_unit_id
INNER JOIN industrial_process.season                se ON se.season_id             = s.season_id

ORDER BY s.session_number DESC;`,
  },
  {
    title: "Rastreabilidade Algodao",
    type: "Power BI / Production",
    accent: "#ff9f6e",
    tabName: "algodao",
    imageSrc: "/dashboards/gallery/img8.png",
    imageAlt: "Dashboard de rastreabilidade de algodao",
    code: `-- Dashboard: Cotton Traceability
SELECT
  field_code,
  roll_number,
  bale_number,
  production_date,
  integration_status
FROM cotton_traceability
WHERE integration_status <> 'Matched';`,
  },
]

export function DashboardGallery() {
  const [mobilePage, setMobilePage] = useState(0)
  const [externalTarget, setExternalTarget] = useState<ExternalLinkTarget | null>(null)
  const mobilePageSize = 2
  const mobilePageCount = Math.ceil(galleryProjects.length / mobilePageSize)
  const mobileStart = mobilePage * mobilePageSize
  const activeProjects = galleryProjects.slice(mobileStart, mobileStart + mobilePageSize)

  const moveMobile = (direction: -1 | 1) => {
    setMobilePage((current) => (current + direction + mobilePageCount) % mobilePageCount)
  }

  return (
    <>
      <div className="md:hidden">
        <div className="mb-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => moveMobile(-1)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#6cf6ff]/22 bg-black/44 text-white/72 backdrop-blur transition hover:border-[#6cf6ff]/50 hover:text-white"
            aria-label="Dashboard anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0 text-center">
            <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.18em] text-[#6cf6ff]/72">
              {mobileStart + 1}-{Math.min(mobileStart + mobilePageSize, galleryProjects.length)} / {galleryProjects.length}
            </p>
            <h3 className="truncate text-sm font-black text-white/86">Dashboards em destaque</h3>
          </div>
          <button
            type="button"
            onClick={() => moveMobile(1)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#6cf6ff]/22 bg-black/44 text-white/72 backdrop-blur transition hover:border-[#6cf6ff]/50 hover:text-white"
            aria-label="Proximo dashboard"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-2">
          {activeProjects.map((project) => (
            <CompactProjectCard key={project.title} project={project} compactMobile onExternalOpen={setExternalTarget} />
          ))}
        </div>
      </div>

      <div className="hidden min-h-0 grid-cols-2 gap-2 md:grid lg:grid-cols-4 2xl:gap-3">
        {galleryProjects.map((project) => (
          <CompactProjectCard key={project.title} project={project} onExternalOpen={setExternalTarget} />
        ))}
      </div>
      {externalTarget && <ExternalLinkDialog item={externalTarget} onClose={() => setExternalTarget(null)} />}
    </>
  )
}

function CompactProjectCard({
  project,
  compactMobile = false,
  onExternalOpen,
}: {
  project: GalleryProject
  compactMobile?: boolean
  onExternalOpen: (target: ExternalLinkTarget) => void
}) {
  const [activePanel, setActivePanel] = useState<"code" | "dashboard">("dashboard")
  const [hasImage, setHasImage] = useState(true)
  const isCodeActive = activePanel === "code"
  const previewClassName = `group relative block h-full w-full overflow-hidden rounded-sm border border-white/[0.06] bg-[#050617] shadow-inner shadow-black/15 transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
    hasImage && project.projectUrl ? "hover:border-white/20 hover:shadow-black/40" : "cursor-default"
  }`

  return (
    <article className={`${compactMobile ? "mx-auto w-[94%]" : ""} overflow-hidden rounded-md border border-[#6cf6ff]/14 bg-[#050617]/82 text-white shadow-[0_0_8px_rgba(108,246,255,0.06)] backdrop-blur 2xl:rounded-lg`}>
      <TerminalHeader
        label={`${project.tabName}.preview`}
        active={!isCodeActive}
        icon={<LayoutDashboard className="h-3 w-3" />}
        onClick={() => setActivePanel("dashboard")}
      />

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isCodeActive ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className={`${compactMobile ? "aspect-video p-1" : "h-[204px] p-1.5"} bg-black/30 md:h-[clamp(148px,22dvh,204px)] md:aspect-auto md:p-1.5 2xl:h-[238px] 2xl:p-2`}>
            {hasImage && project.projectUrl ? (
              <button
                type="button"
                onClick={() => onExternalOpen({ label: "GitHub", href: project.projectUrl! })}
                className={previewClassName}
                aria-label={`Abrir projeto ${project.title} no GitHub`}
              >
                <img
                  src={project.imageSrc}
                  alt={project.imageAlt}
                  onError={() => setHasImage(false)}
                  className="h-full w-full object-contain transition duration-300 ease-out group-hover:scale-[1.035]"
                />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.03]" />
              </button>
            ) : (
              <div className={previewClassName} aria-label={project.imageAlt} aria-disabled={!hasImage}>
              {hasImage ? (
                <img
                  src={project.imageSrc}
                  alt={project.imageAlt}
                  onError={() => setHasImage(false)}
                  className="h-full w-full object-contain transition duration-300 ease-out group-hover:scale-[1.035]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_25%,rgba(108,246,255,0.13),transparent_45%),linear-gradient(135deg,rgba(5,6,23,0.96),rgba(10,12,36,0.88))] px-3 text-center font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-white/42">
                  {project.imageAlt}
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.03]" />
              </div>
            )}
          </div>
        </div>
      </div>

      <TerminalHeader
        label={`${project.tabName}.sql`}
        active={isCodeActive}
        icon={<Code2 className="h-3 w-3" />}
        onClick={() => setActivePanel("code")}
      />

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isCodeActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className={`${compactMobile ? "aspect-video px-1.5 pb-1.5 pt-1.5" : "h-[204px] px-2 pb-2 pt-2"} flex flex-col md:h-[clamp(148px,22dvh,204px)] md:aspect-auto md:px-2 md:pb-2 md:pt-2 2xl:h-[238px] 2xl:px-2.5 2xl:pb-2.5 2xl:pt-2.5`}>
            <div className={`${compactMobile ? "mb-1 min-h-[26px]" : "mb-1.5 min-h-[34px]"} shrink-0 text-center md:mb-1 md:min-h-[30px] 2xl:mb-1.5 2xl:min-h-[36px]`}>
              <p className="font-mono text-[0.48rem] font-bold uppercase tracking-[0.1em] text-[#6cb5ff] 2xl:text-[0.52rem]">{project.type}</p>
              <h3 className="mt-0.5 truncate text-[0.76rem] font-black leading-tight tracking-normal text-white 2xl:text-sm">{project.title}</h3>
            </div>
            <pre
              data-code-scroll
              className="code-scrollbar min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-words rounded-sm border border-white/[0.05] bg-black/44 p-2 font-mono text-[0.46rem] leading-[0.66rem] text-[#d7e7ff] shadow-inner shadow-black/15 2xl:p-2.5 2xl:text-[0.5rem] 2xl:leading-3"
            >
              <code>{project.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </article>
  )
}
function TerminalHeader({
  label,
  active,
  icon,
  onClick,
}: {
  label: string
  active: boolean
  icon: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between border-b border-white/[0.055] px-2 py-1.5 text-left transition 2xl:px-2.5 2xl:py-1.5 ${
        active ? "bg-black/45" : "bg-black/70 hover:bg-black/55"
      }`}
      aria-expanded={active}
    >
      <div className="flex min-w-0 items-center gap-1.5">
        <div className="flex shrink-0 items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff6b5d]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#ffcf7a]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#6cb5ff]" />
        </div>
        <span className="flex min-w-0 items-center gap-1 truncate font-mono text-[0.52rem] text-white/54 2xl:text-[0.58rem]">
          {icon}
          {label}
        </span>
      </div>
      <span className="shrink-0 font-mono text-[0.42rem] uppercase tracking-[0.1em] text-white/28 2xl:text-[0.46rem]">
        {active ? "expandido" : "minimizado"}
      </span>
    </button>
  )
}
