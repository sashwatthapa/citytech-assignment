DROP TABLE IF EXISTS operators.merchants CASCADE;

CREATE TABLE operators.merchants (
    merchant_id BIGSERIAL PRIMARY KEY,

    merchant_code VARCHAR(20) UNIQUE NOT NULL,
    merchant_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(50),
    website_url VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(30),

    registration_number VARCHAR(100),
    country VARCHAR(3) NOT NULL,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),

    acquirer_id BIGINT REFERENCES operators.members(member_id),

    settlement_currency VARCHAR(3) DEFAULT 'USD',
    settlement_cycle VARCHAR(20) DEFAULT 'daily'
        CHECK (settlement_cycle IN ('daily', 'weekly', 'monthly')),
    payout_account_number VARCHAR(50),
    payout_bank_name VARCHAR(100),
    payout_bank_country VARCHAR(3),

    risk_level VARCHAR(20) DEFAULT 'medium'
        CHECK (risk_level IN ('low', 'medium', 'high')),
    daily_txn_limit DECIMAL(18,2),
    monthly_txn_limit DECIMAL(18,2),

    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('active', 'inactive', 'pending')),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE SEQUENCE operators.merchant_code_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    OWNED BY NONE;

CREATE INDEX idx_merchants_merchant_code ON operators.merchants(merchant_code);
CREATE INDEX idx_merchants_country ON operators.merchants(country);
CREATE INDEX idx_merchants_acquirer_id ON operators.merchants(acquirer_id);
CREATE INDEX idx_merchants_status ON operators.merchants(status);

CREATE SEQUENCE operators.merchant_code_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    OWNED BY NONE;

CREATE OR REPLACE FUNCTION operators.generate_merchant_code()
RETURNS TRIGGER AS $$
DECLARE
    seq_number BIGINT;
BEGIN
    IF NEW.merchant_code IS NULL THEN
        seq_number := nextval('operators.merchant_code_seq');
        NEW.merchant_code := 'MCH-' || LPAD(seq_number::TEXT, 5, '0');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_merchant_code
BEFORE INSERT ON operators.merchants
FOR EACH ROW
EXECUTE FUNCTION operators.generate_merchant_code();

-- Sample data
INSERT INTO operators.merchants (
    merchant_code,
    merchant_name,
    business_type,
    website_url,
    contact_email,
    contact_phone,
    registration_number,
    country,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    acquirer_id,
    settlement_currency,
    settlement_cycle,
    payout_account_number,
    payout_bank_name,
    payout_bank_country,
    risk_level,
    daily_txn_limit,
    monthly_txn_limit,
    status
) VALUES (
    'MCH-00001',
    'Skyline Electronics Store',
    'retail',
    'https://skyline-electronics.com',
    'support@skyline-electronics.com',
    '+1-800-555-1234',
    'REG-567890',
    'USA',
    '450 Sunset Blvd',
    NULL,
    'Los Angeles',
    'CA',
    '90001',
    1,
    'USD',
    'daily',
    '987654321000',
    'Bank of America',
    'USA',
    'medium',
    50000.00,
    1500000.00,
    'active'
);