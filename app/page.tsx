import Image from "next/image"
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Sparkles,
} from "lucide-react"
import { DashboardGallery } from "@/components/dashboard-gallery"
import { HorizontalScrollControls } from "@/components/horizontal-scroll-controls"
import { PortfolioNav } from "@/components/portfolio-nav"
import { ProjectTerminalCard } from "@/components/project-terminal-card"

const projects = [
  {
    title: "Fluxo de Chamados",
    type: "Power BI / TI",
    accent: "#ff6b5d",
    dashboardImageSrc: "/dashboards/fluxo-chamado-ti.png",
    dashboardImageAlt: "Dashboard de fluxo de chamados de Tecnologia da Informacao",
    dashboardHref: "https://github.com/duguimaraes/power-bi-analytics-portfolio/tree/main/sla-ti-dashboard",
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
    title: "Controle de Estoque",
    type: "Power BI / Inventory",
    accent: "#6cb5ff",
    dashboardImageSrc: "/dashboards/inventory-control-dashboard.png",
    dashboardImageAlt: "Dashboard de controle de estoque e obsolescencia",
    dashboardHref: "https://github.com/duguimaraes/power-bi-analytics-portfolio/tree/main/inventory-control-dashboard",
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
    title: "Pesagem Manual",
    type: "Power BI / Operations",
    accent: "#ffcf7a",
    dashboardImageSrc: "/dashboards/manual-weighing-dashboard.png",
    dashboardImageAlt: "Dashboard de controle de pesagem manual",
    dashboardHref: "https://github.com/duguimaraes/power-bi-analytics-portfolio/tree/main/manual-weighing-dashboard",
    code: `-- Project: Manual Weighing Control Dashboard
-- Description: SQL queries used to monitor manual truck weighing operations, including approval flow, operational delays, and recurring manual weighing scenarios.

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
]

const skills = [
  "Power BI",
  "DAX",
  "Power Query",
  "SQL Databases",
  "PostgreSQL",
  "Firebird",
  "AWS Athena",
  "AI + MCP",
  "BI Automation",
  "Data Modeling",
]

export default function Home() {
  return (
    <main
      id="portfolio-scroll-root"
      className="no-scrollbar relative flex h-[100dvh] snap-y snap-proximity flex-col overflow-x-hidden overflow-y-auto overscroll-contain scroll-smooth bg-[#07072a] text-white md:snap-x md:snap-mandatory md:flex-row md:overflow-x-auto md:overflow-y-hidden"
    >
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_52%_42%,rgba(124,80,255,0.38),transparent_32%),radial-gradient(circle_at_82%_82%,rgba(255,109,77,0.26),transparent_26%),linear-gradient(135deg,#08082f_0%,#12124b_54%,#05051e_100%)]" />
      <div className="data-bg-pan pointer-events-none fixed -inset-8 z-0">
        <Image
          src="/hero-data-background.png"
          alt=""
          fill
          priority
          aria-hidden="true"
          className="object-cover opacity-[0.44] mix-blend-screen"
        />
      </div>
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_52%,rgba(7,7,42,0.12),rgba(7,7,42,0.5)_62%,rgba(7,7,42,0.78)_100%)]" />
      <HorizontalScrollControls />
      <PortfolioNav />

      <section
        id="inicio"
        className="relative flex min-h-[100dvh] w-full shrink-0 snap-start flex-col overflow-hidden px-5 pb-12 pt-24 sm:px-8 md:h-[100dvh] md:w-screen md:py-5 lg:px-16 lg:py-6"
      >
        <div className="absolute bottom-16 left-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-8 top-32 h-28 w-28 rounded-full bg-rose-400/10 blur-3xl" />

        <div className="relative z-10 grid min-h-0 flex-1 items-center gap-8 md:pb-16 md:pt-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:pb-14 lg:pt-4">
          <div className="max-w-2xl self-center md:translate-x-16 lg:translate-x-28">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white/70">
                <Sparkles className="h-4 w-4 text-[#ffcf7a]" />
                Analista de Dados e BI
              </p>
              <h1 className="text-[2rem] font-black leading-[1.05] tracking-normal sm:text-[2.4rem] md:whitespace-nowrap md:text-[1.6rem] lg:text-[2.1rem]">
                Eduardo Ladeira Guimarães
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
                Transformo processos, dados e ideias em experiências digitais claras. Meu foco é criar
                soluções úteis, bonitas e fáceis de evoluir.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#projetos"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-black text-[#0a0a2d] transition hover:bg-[#ffe2dd]"
                >
                  Ver projetos
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href="mailto:eduardoldrds@gmail.com"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/16 px-5 py-3 text-sm font-bold text-white/78 transition hover:border-white/34 hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                  Contato
                </a>
                <a
                  href="https://github.com/duguimaraes"
                  aria-label="GitHub"
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/12 bg-white/[0.05] transition hover:border-white/30 hover:bg-white/10"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/eduardo-ladeira-guimar%C3%A3es-a272a427b/"
                  aria-label="LinkedIn"
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/12 bg-white/[0.05] transition hover:border-white/30 hover:bg-white/10"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="relative mx-auto flex aspect-square w-[min(78vw,360px)] translate-y-0 items-end justify-center self-center sm:w-[min(58vw,430px)] md:w-[min(78vw,68vh,610px)] md:translate-y-3 lg:w-[min(50vw,78vh,740px)] lg:translate-y-5">
            <div className="absolute bottom-8 h-[82%] w-[82%] rounded-full bg-[linear-gradient(138deg,#754bff_0%,#263d89_46%,#ff8a5b_100%)] shadow-2xl shadow-black/45" />
            <div className="absolute bottom-16 h-[68%] w-[86%] rounded-full border border-white/10 bg-white/[0.04] blur-[1px]" />
            <Image
              src="/hero-avatar.png"
              alt="Avatar 3D de Eduardo com notebook"
              width={1024}
              height={1536}
              priority
              className="relative z-10 h-auto w-[72%] max-w-[455px] drop-shadow-[0_38px_60px_rgba(0,0,0,0.45)]"
            />
          </div>
        </div>
      </section>

      <section id="sobre" className="relative z-10 flex min-h-[100dvh] w-full shrink-0 snap-start items-start px-5 pb-14 pt-28 text-white sm:px-8 md:h-[100dvh] md:w-screen md:items-center md:py-16 lg:px-16">
        <div className="mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#ffcf7a]">Sobre</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal md:text-5xl">
              Transformo dados operacionais em decisões claras.
            </h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-white/72">
              Atuo com Business Intelligence e análise de dados, criando dashboards completos em Power BI
              com SQL, DAX, Power Query e modelagem de dados. Meu trabalho conecta operações, finanças,
              logística e TI em indicadores que ajudam equipes a acompanhar desempenho, encontrar desvios
              e tomar decisões com mais segurança.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-white/12 bg-white/[0.06] px-4 py-2 text-sm font-bold text-white/78"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="projetos" className="relative z-10 flex min-h-[100dvh] w-full shrink-0 snap-start items-start px-5 pb-14 pt-28 text-white sm:px-8 md:h-[100dvh] md:w-screen md:items-center md:py-16 lg:px-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#ff624f]">Projetos</p>
              <h2 className="mt-3 text-4xl font-black tracking-normal md:text-5xl">Trabalhos em destaque</h2>
            </div>
            <p className="max-w-lg text-base leading-7 text-white/72">
              Uma seleção inicial para organizar o portfolio. Depois trocamos estes exemplos pelos seus
              cases reais, métricas e links.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {projects.map((project) => (
              <ProjectTerminalCard key={project.title} {...project} />
            ))}
          </div>
        </div>
      </section>
      <section id="blog" className="relative z-10 flex min-h-[100dvh] w-full shrink-0 snap-start items-stretch px-5 pb-14 pt-28 text-white sm:px-8 md:h-[100dvh] md:w-screen md:py-12 lg:px-16">
        <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-col justify-start md:justify-center">
          <div className="mb-5 flex shrink-0 flex-col justify-between gap-4 md:flex-row md:items-end lg:mb-6">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#6cf6ff]">Galeria</p>
              <h2 className="mt-3 text-4xl font-black tracking-normal md:text-5xl">Dashboards em destaque</h2>
            </div>
            <p className="max-w-lg text-base leading-7 text-white/72">
              Uma vitrine visual com exemplos de dashboards e estudos de BI desenvolvidos para cenarios reais de
              negocio.
            </p>
          </div>
          <DashboardGallery />
        </div>
      </section>
    </main>
  )
}
